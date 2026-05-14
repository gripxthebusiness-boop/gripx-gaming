import React, { useState } from 'react';
import { createOrder } from '../../services/orderService';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';


/**
 * Order Form Component
 * Comprehensive form for creating orders with validation and error handling
 * Usage:
 * <OrderForm 
 *   productName="Gaming Mouse" 
 *   productPrice={49.99} 
 *   onSuccess={() => navigate('/')}
 * />
 */

interface OrderFormProps {
  productName?: string;
  productPrice?: number;
  productId?: string;
  quantity?: number;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  productName = 'Product',
  productPrice = 0,
  productId = '',
  quantity: initialQuantity = 1,
  onSuccess,
  onError,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    product: productName,
    productId: productId,
    quantity: initialQuantity,
    price: productPrice,
    customer: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /**
   * Validate form data
   */
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.customer.trim()) {
      errors.customer = 'Customer name is required';
    } else if (formData.customer.length < 2) {
      errors.customer = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]{10,15}$/.test(formData.phone)) {
      errors.phone = 'Enter a valid phone number (10-15 digits)';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.length < 5) {
      errors.address = 'Address must be at least 5 characters';
    }

    if (formData.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (formData.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await createOrder(formData);

      if (result.success) {
        // Success!
        const orderId = result.data?.id;
        const orderNumber = result.data?.orderNumber;

        setSuccessMessage(
          `Order created successfully! Order #${orderNumber}`
        );

        // Reset form
        setFormData({
          product: productName,
          productId: productId,
          quantity: initialQuantity,
          price: productPrice,
          customer: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postalCode: '',
          notes: '',
        });

        // Call success callback
        if (onSuccess && orderId) {
          setTimeout(() => onSuccess(orderId), 1500);
        }
      } else {
        // Error from API
        setErrorMessage(result.error || 'Failed to create order');
        if (onError) {
          onError(result.error || 'Failed to create order');
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  const totalPrice = formData.quantity * formData.price;

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Place Your Order</CardTitle>
          <CardDescription className="text-blue-100">
            Fill out the form below to complete your purchase
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Product Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">{productName}</span>
              <span className="font-semibold">${productPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quantity: {formData.quantity}</span>
              <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              ✅ {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              ❌ {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max="1000"
                className={fieldErrors.quantity ? 'border-red-500' : ''}
              />
              {fieldErrors.quantity && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.quantity}</p>
              )}
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="customer"
                placeholder="John Doe"
                value={formData.customer}
                onChange={handleChange}
                className={fieldErrors.customer ? 'border-red-500' : ''}
              />
              {fieldErrors.customer && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.customer}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-gray-400">(optional)</span>
              </label>
              <Input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={fieldErrors.email ? 'border-red-500' : ''}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                className={fieldErrors.phone ? 'border-red-500' : ''}
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="address"
                placeholder="123 Main Street, Apartment 4B"
                value={formData.address}
                onChange={handleChange}
                className={fieldErrors.address ? 'border-red-500' : ''}
              />
              {fieldErrors.address && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.address}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-gray-400">(optional)</span>
              </label>
              <Input
                type="text"
                name="city"
                placeholder="New York"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code <span className="text-gray-400">(optional)</span>
              </label>
              <Input
                type="text"
                name="postalCode"
                placeholder="10001"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                name="notes"
                placeholder="Any special requests or delivery instructions..."
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-lg font-semibold transition"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Place Order - $${totalPrice.toFixed(2)}`
              )}
            </Button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-sm">
            <p className="font-semibold mb-2">📦 Order Information</p>
            <ul className="space-y-1 text-gray-700">
              <li>✓ All orders are confirmed and processed within 24 hours</li>
              <li>✓ You will receive a confirmation via email or phone</li>
              <li>✓ Free shipping on orders over $100</li>
              <li>✓ 30-day money-back guarantee</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;
