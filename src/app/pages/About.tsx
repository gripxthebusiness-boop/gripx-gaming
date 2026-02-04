import { motion } from 'framer-motion';
import { Target, Users, Award, Zap } from 'lucide-react';

export function About() {
  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Quality',
      description: 'We curate only authentic, high-quality products from trusted brands.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Customer Focus',
      description: 'Your satisfaction is our top priority. Excellent customer service always.',
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Best Prices',
      description: 'Competitive pricing on all electronics without compromising quality.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your products to you on time.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gray-900">About</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                NeoSell
              </span>
            </h1>
            <p className="text-xl text-gray-900 mb-8 max-w-2xl mx-auto">
              Your trusted source for premium electronics and gadgets at unbeatable prices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-800">What makes us your trusted electronics partner</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-white border border-red-600/20 hover:border-red-600/50 transition-all p-8 text-center">
                  <div className="text-red-500 mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-800">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;