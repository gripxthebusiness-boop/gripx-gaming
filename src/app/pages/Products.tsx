import { motion } from 'framer-motion';
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
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Unable to load products right now.');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Unable to load products right now.');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = (productId: string, images: string[]) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % images.length,
    }));
  };

  const prevImage = (productId: string, images: string[]) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]:
        prev[productId] === 0
          ? images.length - 1
          : (prev[productId] || 0) - 1,
    }));
  };

  const categories = ['All', 'Mice', 'Keyboards', 'Headsets', 'Controllers'];

  const filteredProducts =
    activeFilter === 'All'
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

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-200">
            {error}
          </div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          {categories.map(category => (
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
                <Link
                  to={`/products/${product._id}`}
                  className="block relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            prevImage(product._id, product.images);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full z-10"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            nextImage(product._id, product.images);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full z-10"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 mb-4">{product.specs}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl text-cyan-400 font-bold">
                        ₹{product.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            image: product.images[0],
                          });
                        }}
                        disabled={!product.inStock}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                          product.inStock
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart size={18} />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
          {!filteredProducts.length && !error && (
            <div className="col-span-full text-center text-gray-400 py-12">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ✅ THIS LINE FIXES VERCEL */
export default Products;

