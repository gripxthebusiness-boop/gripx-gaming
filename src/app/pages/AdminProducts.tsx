import { useState, useEffect } from 'react';
// Cloudinary upload
const CLOUDINARY_CLOUD_NAME = 'dhx8tsvpm';
const CLOUDINARY_UPLOAD_PRESET = 'neosellcloud'; // Your unsigned preset name
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Package, DollarSign, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Table, Trash } from 'lucide-react';
import Papa from 'papaparse';

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
        setError(`Unable to connect to backend. API URL: ${API_BASE || 'Not configured'}. Please ensure the backend is running and VITE_API_URL is set correctly.`);
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

  // Handler for CSV spec upload
  const handleSpecFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        // Expect columns: Specification, Value
        const parsed = results.data.map((row: any) => ({
          key: row.Specification || row.Key || '',
          value: row.Value || '',
        })).filter((row: any) => row.key && row.value);
        setSpecItems(parsed);
      },
    });
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
                    {/* Image preview */}
                    {image && image.startsWith('http') && (
                      <img src={image} alt="preview" className="w-16 h-16 object-cover rounded border border-gray-300 mr-2" />
                    )}
                    {/* File input for Cloudinary upload */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        // Upload to Cloudinary
                        const formDataCloud = new FormData();
                        formDataCloud.append('file', file);
                        formDataCloud.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                        try {
                          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                            method: 'POST',
                            body: formDataCloud,
                          });
                          const data = await res.json();
                          if (data.secure_url) {
                            const newImages = [...formData.images];
                            newImages[index] = data.secure_url;
                            setFormData({ ...formData, images: newImages });
                          } else {
                            alert('Image upload failed.');
                          }
                        } catch (err) {
                          alert('Image upload error.');
                        }
                      }}
                      className="flex-1 px-2 py-2 bg-red-50 border border-red-300 rounded-lg text-gray-900 focus:border-red-600 focus:outline-none"
                    />
                    {/* Remove image button */}
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
                <p className="text-xs text-gray-700 mt-2">Upload product images (first image will be the thumbnail).</p>
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

              {/* Specifications Table Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  <div className="flex items-center gap-2">
                    <Table size={16} />
                    <span>Specifications (Upload CSV)</span>
                  </div>
                </label>
                <div className="mb-3">
                  <label className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 text-gray-900 rounded-lg hover:bg-red-200 transition-colors cursor-pointer">
                    <span>📤 Upload CSV File</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleSpecFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-700 mt-2">CSV should have columns: Specification, Value</p>
                </div>
                <div className="bg-red-50/50 rounded-lg overflow-hidden border border-red-300">
                  <table className="w-full">
                    <thead className="bg-red-100/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Specification</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {specItems.map((spec, index) => (
                        <tr key={index}>
                          <td className="px-2 py-2">{spec.key}</td>
                          <td className="px-2 py-2">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                      <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Products Table */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-red-600/30 rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-100 to-red-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Brand</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-red-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {product.images?.[0] && (
                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded object-cover" />
                          )}
                          <span className="text-gray-900 font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-800">{product.brand}</td>
                      <td className="px-6 py-4 text-gray-800">{product.category}</td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">₹{product.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap ${
                          product.inStock
                            ? 'bg-green-100/50 text-green-700'
                            : 'bg-red-100/50 text-red-700'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Delete product"
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
          </motion.div>
        )}

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-800">No products found. Add your first product to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;

