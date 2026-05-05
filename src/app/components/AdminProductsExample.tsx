import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';

/**
 * Example: How to integrate the ImageUploader component in your forms
 * 
 * This shows how to use the ImageUploader component in the AdminProducts page
 * or any other form that needs to upload product images to Cloudinary.
 */

export function AdminProductsWithImageUpload() {
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [token] = useState(() => localStorage.getItem('token') || '');

  const handleImagesUploaded = (imageUrls: string[]) => {
    setUploadedImageUrls(imageUrls);
    console.log('Uploaded images from Cloudinary:', imageUrls);
  };

  const handleCreateProduct = async (productData: any) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...productData,
          images: uploadedImageUrls, // Use Cloudinary image URLs
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Product created with Cloudinary images:', result);
        setUploadedImageUrls([]); // Clear after successful creation
      } else {
        console.error('Failed to create product:', result);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Product</h2>

      {/* Image Uploader Component - Uses Cloudinary Widget */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Product Images (Cloudinary)</h3>
        <ImageUploader
          onImagesUploaded={handleImagesUploaded}
          maxImages={5}
          token={token}
        />
        <p className="text-sm text-gray-500 mt-4">
          Images are uploaded directly to Cloudinary and optimized automatically.
        </p>
      </div>

      {/* Other form fields would go here */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input type="text" className="w-full border rounded-lg p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <input type="number" className="w-full border rounded-lg p-2" />
        </div>

        {/* Submit button */}
        <button
          onClick={() => handleCreateProduct({ name: 'Test' })}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          disabled={uploadedImageUrls.length === 0}
        >
          Create Product
        </button>
      </div>

      {/* Display uploaded image URLs for reference */}
      {uploadedImageUrls.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Uploaded Image URLs (from Cloudinary):</h4>
          <ul className="space-y-2">
            {uploadedImageUrls.map((url, index) => (
              <li key={index} className="text-sm break-all text-gray-700">
                <strong>{index + 1}.</strong> 
                <code className="bg-white p-1 rounded ml-2 text-xs">
                  {url}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminProductsWithImageUpload;
