# Cloudinary Integration Guide

This guide explains how to set up and use Cloudinary for image and CSV file uploads in your Gripx Gaming e-commerce application.

## Overview

Cloudinary is integrated into both the frontend and backend for managing product images and specification CSV files. The application uses:

1. **Backend Upload API** - Secure server-side uploads with authentication
2. **Automatic Image Optimization** - Images are automatically resized and optimized
3. **CSV File Storage** - Specification files stored as raw resources

## Environment Variables Setup

### For Vercel (Frontend)

The frontend uses environment variables for API connectivity. No Cloudinary variables are needed on the frontend as uploads go through the backend API.

### For Render/Backend

Add these environment variables to your Render backend deployment:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Getting Your Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Account Console
3. Copy the following from your dashboard:
   - **Cloud Name** - Your unique cloud identifier
   - **API Key** - Your API key
   - **API Secret** - Keep this secure, never expose it client-side

## Backend Upload Routes

### Upload Product Images

**Endpoint:** `POST /api/upload/image`

**Authentication:** Required (Admin only)

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `image`
- File: Image file (jpg, jpeg, png, webp, gif)

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "image": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "neosell/products/xyz123",
    "width": 1200,
    "height": 1200,
    "format": "jpg"
  }
}
```

### Upload Multiple Images

**Endpoint:** `POST /api/upload/images`

**Authentication:** Required (Admin only)

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `images`
- Files: Up to 5 image files

**Response:**
```json
{
  "message": "Images uploaded successfully",
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "public_id": "neosell/products/xyz123",
      "width": 1200,
      "height": 1200,
      "format": "jpg"
    }
  ]
}
```

### Upload CSV Specifications

**Endpoint:** `POST /api/upload/csv`

**Authentication:** Required (Admin only)

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `csv`
- File: CSV file

**Response:**
```json
{
  "message": "CSV file uploaded successfully",
  "file": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "neosell/specs/abc456",
    "format": "csv",
    "resource_type": "raw"
  }
}
```

### Delete Image

**Endpoint:** `DELETE /api/upload/:publicId`

**Authentication:** Required (Admin only)

**Description:** Delete an image from Cloudinary by its public ID.

## Frontend Usage

The AdminProducts page automatically uses the backend upload API when you:

1. Click "Add Product" or edit an existing product
2. Select an image file in the Product Images section
3. The image is uploaded to Cloudinary via the backend
4. The Cloudinary URL is stored in the product data

### CSV Upload for Specifications

1. Prepare a CSV file with columns: `Specification, Value`
2. Click the "Upload CSV File" button
3. The CSV is parsed client-side using PapaParse
4. Specifications are displayed in a table for review

## File Organization in Cloudinary

Your Cloudinary media library will be organized as follows:

```
neosell/
├── products/
│   ├── image1.jpg
│   ├── image2.png
│   └── ...
└── specs/
    ├── specs1.csv
    └── ...
```

## Image Transformations

Images are automatically optimized with:
- Maximum dimensions: 1200x1200 pixels
- Quality: Auto (balanced quality/size)
- Format: Original format preserved

You can apply additional transformations by modifying the CloudinaryStorage configuration in `backend/routes/upload.js`.

## Security Considerations

1. **Authentication Required** - All upload endpoints require admin authentication
2. **File Size Limits** - Images: 10MB max, CSV: 5MB max
3. **File Type Validation** - Only allowed formats are accepted
4. **API Secret Protection** - Never expose Cloudinary API secret in frontend code

## Troubleshooting

### Upload Fails with Authentication Error
- Ensure you're logged in as an admin user
- Check that your auth token is valid

### Upload Fails with Configuration Error
- Verify Cloudinary environment variables are set correctly in Render
- Check that your Cloudinary account is active

### Images Not Displaying
- Verify the image URLs are accessible
- Check CORS settings if images are blocked

## Migration from Direct Frontend Uploads

If you previously used direct Cloudinary uploads from the frontend (unsigned uploads), you should:

1. Update your Cloudinary upload preset settings if needed
2. Or switch to the backend API for better security
3. Update any existing product image URLs if you change upload methods

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Multer Storage Cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)

## Support

For issues specific to:
- **Cloudinary service** - Contact Cloudinary support
- **This application** - Check the project's issue tracker