import { motion } from 'motion/react';
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LazyImage } from '../components/LazyImage';
import { useCart } from '../context/CartContext';

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
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = (productId: string, images: string[]) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % images.length
    }));
  };

  const prevImage = (productId: string, images: string[]) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: prev[productId] === 0 ? images.length - 1 : (prev[productId] || 0) - 1
    }));
  };

  const categories = ['All', 'Mice', 'Keyboards', 'Headsets', 'Controllers'];

  const filteredProducts = activeFilter === 'All'
    ? products
    : products.filter(p => p.category === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Premium
            </span>{' '}
            Gaming Gear
          </h1>
          <p className="text-gray-400 text-lg">
            Curated gaming gear from trusted brands in India
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-gray-900 text-gray-400 border border-cyan-500/20 hover:border-cyan-500/50'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => {
            const currentImageIndex = currentImageIndexes[product._id] || 0;
            const currentImage = product.images?.[currentImageIndex] || '';

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                    {/* Image Navigation */}
                    {product.images && product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(product._id, product.images)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() => nextImage(product._id, product.images)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight size={16} />
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                          {product.images.map((_, imgIndex) => (
                            <div
                              key={imgIndex}
                              className={`w-2 h-2 rounded-full ${
                                imgIndex === currentImageIndex ? 'bg-cyan-400' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {product.category}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">{product.specs}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-cyan-400">₹{product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center space-x-2"
                      >
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}