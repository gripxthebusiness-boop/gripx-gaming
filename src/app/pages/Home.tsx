import { motion } from 'framer-motion';
import { ChevronRight, Zap, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../components/LazyImage';

export function Home() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Wide Selection',
      description: 'Extensive range of electronics from top brands',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Best Prices',
      description: 'Competitive pricing on all products',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Guaranteed Quality',
      description: 'Authentic products with warranty support',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <LazyImage
            src="https://images.unsplash.com/photo-1694919123854-24b74b376da1?w=400&q=80"
            alt="Gaming Setup"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Your Trusted</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                Electronics Store
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Shop premium electronics and gadgets from trusted brands at unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all group"
              >
                Explore Products
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-red-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-red-600 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose NeoSell?</h2>
            <p className="text-gray-400">Premium electronics at unbeatable prices</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl hover:border-red-600/50 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;