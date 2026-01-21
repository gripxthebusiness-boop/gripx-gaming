import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link
            to="/"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account,
                make a purchase, or contact us for support. This may include your name, email address,
                phone number, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to provide, maintain, and improve our services,
                process transactions, send you technical notices and support messages, and respond
                to your comments and questions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties
                without your consent, except as described in this policy or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us through our
                contact page or reach out via WhatsApp/phone for immediate assistance.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
