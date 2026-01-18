import { motion } from 'motion/react';
import { LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';

export function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mice',
    price: '',
    rating: 4.5,
    image: '',
    specs: '',
    description: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${API_URL}/products/${editingId}`
        : `${API_URL}/products`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchProducts();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          name: '',
          category: 'Mice',
          price: '',
          rating: 4.5,
          image: '',
          specs: '',
          description: '',
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-gray-400">
              Welcome, <span className="text-cyan-400 font-semibold">{user?.username}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </motion.div>

        {/* Add Product Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              category: 'Mice',
              price: '',
              rating: 4.5,
              image: '',
              specs: '',
              description: '',
            });
          }}
          className="mb-8 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
        >
          <Plus size={20} />
          <span>{showForm ? 'Cancel' : 'Add New Product'}</span>
        </motion.button>

        {/* Add/Edit Product Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-8 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-3 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                required
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="p-3 bg-gray-900 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Mice">Mice</option>
                <option value="Keyboards">Keyboards</option>
                <option value="Headsets">Headsets</option>
                <option value="Controllers">Controllers</option>
              </select>

              <input
                type="text"
                placeholder="Price (e.g., $79.99)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="p-3 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                required
              />

              <input
                type="number"
                placeholder="Rating (0-5)"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="p-3 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />

              <input
                type="url"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="p-3 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 md:col-span-2"
                required
              />

              <input
                type="text"
                placeholder="Specs"
                value={formData.specs}
                onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                className="p-3 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 md:col-span-2"
                required
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="p-3 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 md:col-span-2 min-h-24"
              />

              <button
                type="submit"
                className="md:col-span-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Products List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Products</h2>
          {loading ? (
            <div className="text-center text-gray-400">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No products yet. Add your first product!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-cyan-500/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-white font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Category</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Price</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Rating</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-cyan-500/10 hover:bg-gray-900/50 transition-colors"
                    >
                      <td className="px-6 py-3 text-gray-300">{product.name}</td>
                      <td className="px-6 py-3 text-gray-300">{product.category}</td>
                      <td className="px-6 py-3 text-cyan-400">{product.price}</td>
                      <td className="px-6 py-3 text-gray-300">{product.rating}</td>
                      <td className="px-6 py-3 space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center space-x-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                        >
                          <Edit2 size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="inline-flex items-center space-x-1 px-3 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
