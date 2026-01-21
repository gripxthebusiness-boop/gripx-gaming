import { motion } from 'motion/react';
import { Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { LazyImage } from '../components/LazyImage';

export function Products() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const products = [
    {
      id: 1,
      name: 'GripX Pro Mouse',
      category: 'Mice',
      price: '₹6,599',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1616296425622-4560a2ad83de?w=400&q=80',
      specs: '20,000 DPI, RGB, Wireless',
    },
    {
      id: 2,
      name: 'GripX Elite Keyboard',
      category: 'Keyboards',
      price: '₹12,499',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1656711081969-9d16ebc2d210?w=400&q=80',
      specs: 'Mechanical, RGB, Hot-Swappable',
    },
    {
      id: 3,
      name: 'GripX Ultra Headset',
      category: 'Headsets',
      price: '₹16,599',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1629429407756-4a7703614972?w=400&q=80',
      specs: '7.1 Surround, Wireless, 50mm Drivers',
    },
    {
      id: 4,
      name: 'GripX Precision Controller',
      category: 'Controllers',
      price: '₹7,439',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1611138290962-2c550ffd4002?w=400&q=80',
      specs: 'Hall Effect, Programmable, RGB',
    },
    {
      id: 5,
      name: 'GripX Speed Mouse',
      category: 'Mice',
      price: '₹4,979',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1616296425622-4560a2ad83de?w=400&q=80',
      specs: '16,000 DPI, Lightweight, Wired',
    },
    {
      id: 6,
      name: 'GripX Compact Keyboard',
      category: 'Keyboards',
      price: '₹8,299',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1656711081969-9d16ebc2d210?w=400&q=80',
      specs: '60%, Mechanical, RGB',
    },
  ];

  const categories = ['All', 'Mice', 'Keyboards', 'Headsets', 'Controllers'];
  
  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(p => p.category === activeFilter);

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
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <LazyImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
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
                    <span className="text-2xl font-bold text-cyan-400">{product.price}</span>
                    <Link to="/contact" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center space-x-2">
                      <ShoppingCart size={18} />
                      <span>Buy Now</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}