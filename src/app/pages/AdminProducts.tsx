import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Package, DollarSign, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Table, Trash } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  specs: string;
  rating: number;
  inStock: boolean;
  stockQuantity: number | null;
}

interface SpecItem {
  key: string;
  value: string;
}

export function AdminProducts() {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  console.log('API_BASE:', API_BASE); // Debug API URL
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [specItems, setSpecItems] = useState<SpecItem[]>([{ key: '', value: '' }]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    images: [''],
    description: '',
    category: '',
    rating: '4.5',
    inStock: true,
    stockQuantity: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${API_BASE}/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        // Handle both array response and paginated object response
        const productsArray = Array.isArray(data) ? data : (data.products || []);
        setProducts(productsArray);
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (response.status === 500 || !response.ok) {
        setError('Unable to connect to server. Please ensure the backend is running.');
      } else {
        setError('Failed to load products');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setError('Request timed out. Server may be unreachable.');
      } else if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
        setError('Unable to connect to server. Please check that the backend is running on http://localhost:5000');
      } else {
        console.error('Failed to fetch products:', error);
        setError('Failed to load products: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Parse specs string to array for editing
  const parseSpecsToArray = (specsText: string): SpecItem[] => {
    if (!specsText) return [{ key: '', value: '' }];
    const lines = specsText.split('\n');
    const specs: SpecItem[] = [];
    
    lines.forEach(line => {
      if (line.includes(':')) {
        const colonIndex = line.indexOf(':');
        const key = line.substring(0, colonIndex);
        const value = line.substring(colonIndex + 1);
        if (key.trim() || value.trim()) {
          specs.push({ key: key.trim(), value: value.trim() });
        }
      } else if (line.includes('-') && !line.startsWith('-')) {
        const dashIndex = line.indexOf('-');
        const key = line.substring(0, dashIndex);
        const value = line.substring(dashIndex + 1);
        if (key.trim() || value.trim()) {
          specs.push({ key: key.trim(), value: value.trim() });
        }
      } else if (line.trim()) {
        specs.push({ key: '', value: line.trim() });
      }
    });
    
    return specs.length > 0 ? specs : [{ key: '', value: '' }];
  };

  // Convert spec items array to string for storage
  const specsArrayToString = (items: SpecItem[]): string => {
    return items
      .filter(item => item.key || item.value)
      .map(item => `${item.key}: ${item.value}`)
      .join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const specsString = specsArrayToString(specItems);
    const stockQuantityValue = formData.stockQuantity ? parseInt(formData.stockQuantity) : null;

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating),
      specs: specsString,
      stockQuantity: stockQuantityValue
    };

    console.log('Submitting product data:', productData); // Debug form data

    try {
      const url = editingProduct ? `${API_BASE}/products/${editingProduct._id}` : `${API_BASE}/products`;
      const method = editingProduct ? 'PUT' : 'POST';
      const token = localStorage.getItem('token');

      console.log('Submitting to:', url, 'Method:', method); // Debug API call
      console.log('Token present:', !!token); // Debug token

      if (!token) {
        throw new Error('Authentication required. Please log in as an admin.');
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      console.log('Response:', response.status, data); // Debug response

      if (response.ok) {
        const message = editingProduct ? 'Product updated successfully!' : `Product "${formData.name}" created successfully!`;
        setSuccess(message);
        console.log('Product saved successfully:', message); // Debug success
        fetchProducts();
        resetForm();
      } else {
        const errorMessage = data.message || `Failed to ${editingProduct ? 'update' : 'create'} product`;
        setError(errorMessage);
        console.error('Error saving product:', errorMessage); // Debug error
      }
    } catch (error: any) {
      console.error('Failed to save product:', error);
      setError(error.message || 'Failed to save product. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (response.ok) {
        fetchProducts();
      } else {
        setError('Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      price: '',
      images: [''],
      description: '',
      category: '',
      rating: '4.5',
      inStock: true,
      stockQuantity: ''
    });
    setSpecItems([{ key: '', value: '' }]);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || '',
      price: product.price.toString(),
      images: product.images || [''],
      description: product.description || '',
      category: product.category,
      rating: product.rating.toString(),
      inStock: product.inStock,
      stockQuantity: product.stockQuantity?.toString() || ''
    });
    setSpecItems(parseSpecsToArray(product.specs));
    setShowAddForm(true);
  };

  // Spec table handlers
  const addSpecRow = () => {
    setSpecItems([...specItems, { key: '', value: '' }]);
  };

  const removeSpecRow = (index: number) => {
    if (specItems.length > 1) {
      const newItems = specItems.filter((_, i) => i !== index);
      setSpecItems(newItems);
    }
  };

  const updateSpecRow = (index: number, field: 'key' | 'value', value: string) => {
    const newItems = [...specItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSpecItems(newItems);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-gray-900 rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => {
                setError(null);
                fetchProducts();
              }}
              className="px-3 py-1 bg-red-600/30 hover:bg-red-600/50 text-red-200 rounded-lg transition-colors text-sm flex items-center space-x-1"
            >
              <Loader2 size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 px-4 py-3 rounded-lg border border-green-500/40 bg-green-500/10 text-green-200 flex items-center space-x-2">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-white border border-red-600/30 rounded-xl p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-800 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-red-50 border border-red-300 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full px-4 py-2 bg-red-50 border border-red-300 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 bg-red-50 border border-red-300 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 bg-red-50 border border-red-300 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Mice">Mice</option>
                  <option value="Keyboards">Keyboards</option>
                  <option value="Headsets">Headsets</option>
                  <option value="Monitors">Monitors</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Product Images</label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = e.target.value;
                        setFormData({...formData, images: newImages});
                      }}
                      className="flex-1 px-4 py-2 bg-red-50 border border-red-300 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none"
                      placeholder="Enter image URL"
                      required={index === 0}
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({...formData, images: newImages});
                        }}
                        className="px-3 py-2 bg-red-600 text-gray-900 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({...formData, images: [...formData.images, '']})}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-gray-900 rounded-lg hover:bg-red-300 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Another Image</span>
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 bg-red-50 border border-red-300 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none"
                />
              </div>

              {/* Specifications Table */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  <div className="flex items-center gap-2">
                    <Table size={16} />
                    <span>Specifications</span>
                  </div>
                </label>
                <div className="bg-red-50/50 rounded-lg overflow-hidden border border-red-300">
                  <table className="w-full">
                    <thead className="bg-red-100/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Specification</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Value</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {specItems.map((spec, index) => (
                        <tr key={index}>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={spec.key}
                              onChange={(e) => updateSpecRow(index, 'key', e.target.value)}
                              placeholder="e.g., Sensor"
                              className="w-full px-3 py-2 bg-red-50 border border-red-300 rounded-lg text-gray-900 text-sm focus:border-red-600 focus:outline-none"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => updateSpecRow(index, 'value', e.target.value)}
                              placeholder="e.g., Optical"
                              className="w-full px-3 py-2 bg-red-50 border border-red-300 rounded-lg text-gray-900 text-sm focus:border-red-600 focus:outline-none"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => removeSpecRow(index)}
                              disabled={specItems.length === 1}
                              className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 border-t border-red-200">
                    <button
                      type="button"
                      onClick={addSpecRow}
                      className="flex items-center gap-2 px-4 py-2 bg-red-700/20 text-red-500 rounded-lg hover:bg-red-700/30 transition-colors text-sm"
                    >
                      <Plus size={16} />
                      Add Specification
                    </button>
                  </div>
                </div>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    <span>Stock Quantity</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-4 py-2 bg-red-50 border border-red-300 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none"
                />
                <p className="text-xs text-gray-800 mt-1">Leave empty to not show stock count to customers</p>
              </div>

              {/* In Stock Toggle */}
              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                    className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-600 bg-red-50"
                  />
                  <span className="text-gray-900">Product is in stock</span>
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="px-6 py-2 border border-red-300 text-gray-900 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-gray-900 rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Products Table */}
        <div className="bg-gradient-to-br from-white to-white border border-red-600/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img className="h-12 w-12 rounded-lg object-cover" src={product.images?.[0] || ''} alt={product.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-800 truncate max-w-xs">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.brand || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">₹{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                          product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.inStock && product.stockQuantity !== null && (
                          <span className="text-xs text-gray-800 mt-1">{product.stockQuantity} units</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(product)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-800 mb-4" />
              <p className="text-gray-800">No products found. Add your first product to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;

