export function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-900 to-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="bg-gradient-to-br from-gray-100/80 to-white/80 backdrop-blur-sm border border-red-600/20 rounded-xl p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-700 mb-6">
              Welcome to NeoSell. These terms and conditions outline the rules and regulations
              for the use of our website and services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using NeoSell, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Products and Services</h2>
            <ul className="text-gray-700 mb-6 list-disc list-inside space-y-2">
              <li>We curate and resell gaming peripherals from trusted manufacturers</li>
              <li>All products are subject to availability</li>
              <li>Prices are in Indian Rupees (INR) and include applicable taxes</li>
              <li>We accept Cash on Delivery (COD) payments only</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping and Delivery</h2>
            <p className="text-gray-700 mb-6">
              Orders are processed and shipped via courier services. Delivery times may vary based
              on location and product availability. We will contact you via WhatsApp or phone to
              confirm order details before shipping.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns and Refunds</h2>
            <p className="text-gray-700 mb-6">
              We want you to be satisfied with your purchase. Please contact us immediately if you
              receive damaged or incorrect items. Return policies will be communicated on a
              case-by-case basis.
            </p>

            <p className="text-gray-700">
              This terms of service document will be updated with complete details. For any questions,
              please contact us through our contact page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
