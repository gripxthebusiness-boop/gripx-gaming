import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface UploadedImage {
  url: string;
  publicId: string;
  filename: string;
}

interface ImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  maxImages?: number;
  token: string;
}

export const ImageUploader: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  maxImages = 5,
  token,
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Cloudinary widget script
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/latest/cw-2.0.0.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpload = () => {
    if (uploadedImages.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (!window.cloudinary) {
      setError('Cloudinary widget not loaded. Please refresh the page.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        folder: 'gripx/products',
        maxFiles: maxImages - uploadedImages.length,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        showAdvancedOptions: false,
        cropping: false,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90a0b9',
            tabIcon: '#0078d4',
            menuIcons: '#5a7684',
            textDark: '#2f3f52',
            textLight: '#78909c',
            link: '#0078d4',
            action: '#0078d4',
            inactiveTabIcon: '#0055cc',
            error: '#F44235',
            inProgress: '#0078d4',
            complete: '#20b55a',
            sourceBg: '#E8EBF1',
          },
          fonts: {
            default: null,
            "'Fira Sans', sans-serif": {
              url: 'https://fonts.googleapis.com/css?family=Fira+Sans',
              active: true,
            },
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          const newImage: UploadedImage = {
            url: result.info.secure_url,
            publicId: result.info.public_id,
            filename: result.info.original_filename,
          };

          const newImages = [...uploadedImages, newImage];
          setUploadedImages(newImages);
          onImagesUploaded(newImages.map(img => img.url));
          setError(null);
        } else if (error) {
          setError(error.message || 'Upload failed');
        }
      }
    );

    widget.open();
  };

  const removeImage = async (index: number) => {
    const imageToRemove = uploadedImages[index];
    setIsLoading(true);

    try {
      // Call backend to delete from Cloudinary
      const response = await fetch(
        `/api/upload/delete/${encodeURIComponent(imageToRemove.publicId)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        onImagesUploaded(newImages.map(img => img.url));
      } else {
        setError('Failed to delete image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={isLoading || uploadedImages.length >= maxImages}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>
              {uploadedImages.length >= maxImages
                ? 'Maximum Images Reached'
                : 'Upload Images'}
            </span>
          </>
        )}
      </button>

      {/* Info Text */}
      <p className="text-sm text-gray-600">
        {uploadedImages.length}/{maxImages} images uploaded
      </p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  disabled={isLoading}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  title="Remove image"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {image.filename}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
