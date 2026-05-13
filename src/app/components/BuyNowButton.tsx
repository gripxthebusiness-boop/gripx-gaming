import React, { useState } from 'react';
import { createOrder } from '../services/orderService';
import { Button } from '../app/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '../app/components/ui/alert-dialog';

/**
 * Buy Now Button Component
 * Minimal button that opens an order modal dialog
 * Perfect for quick checkout from product pages
 */

interface BuyNowButtonProps {
  productName: string;
  productPrice: number;
  productId?: string;
  quantity?: number;
  onSuccess?: (orderId: string) => void;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  productName,
  productPrice,
  productId = '',
  quantity = 1,
  onSuccess,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError('');

    // Quick validation
    if (!formData.customer.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const result = await createOrder({
        product: productName,
        quantity,
        price: productPrice,
        productId,
        customer: formData.customer,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      if (result.success) {
        alert(`✅ Order placed successfully!\nOrder #: ${result.data?.orderNumber}`);
        setShowDialog(false);
        setFormData({ customer: '', email: '', phone: '', address: '' });
        if (onSuccess && result.data?.id) {
          onSuccess(result.data.id);
        }
      } else {
        setError(result.error || 'Failed to place order');
      }
    } catch (err) {
      setError('An error occurred while placing the order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        🛒 Buy Now - ${productPrice.toFixed(2)}
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Quick Checkout</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 my-4">
                {/* Product Info */}
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">{productName}</p>
                  <p className="text-lg font-bold text-gray-900">${productPrice.toFixed(2)}</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
                    {error}
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-2">
                  <input
                    type="text"
                    name="customer"
                    placeholder="Your Name *"
                    value={formData.customer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email (optional)"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Delivery Address *"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex gap-2 justify-end">
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'Processing...' : 'Confirm Order'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BuyNowButton;
