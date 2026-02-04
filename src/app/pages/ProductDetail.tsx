import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, ShoppingCart, ChevronLeft, ChevronRight, ArrowLeft, Package, AlertCircle } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';
import { useCart } from '../context/CartContext';

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  specs: string;
  rating: number;
  inStock: boolean;
  stockQuantity: number | null;
}

interface ProductDetailsResponse {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  // Use React Query for caching and single API call fetching product + related products
  const { data, isLoading, error, isError } = useQuery<ProductDetailsResponse>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/products/${id}/details`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    enabled: !!id,
  });

  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImageIndex(0);
  }, [id]);

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={`${
          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'
        }`}
      />
    ));
  };

  // Parse specs string into key-value pairs for table display
  const parseSpecs = (specsText: string) => {
    if (!specsText) return [];
    const lines = specsText.split('\n');
    const specs: { key: string; value: string }[] = [];
    
    lines.forEach(line => {
      if (line.includes(':')) {
        const colonIndex = line.indexOf(':');
        const key = line.substring(0, colonIndex);
        const value = line.substring(colonIndex + 1);
        specs.push({ key: key.trim(), value: value.trim() });
      } else if (line.includes('-') && !line.startsWith('-')) {
        const dashIndex = line.indexOf('-');
        const key = line.substring(0, dashIndex);
        const value = line.substring(dashIndex + 1);
        specs.push({ key: key.trim(), value: value.trim() });
      } else if (line.trim()) {
        specs.push({ key: '', value: line.trim() });
      }
    });
    
    return specs;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-red-500 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white flex items-center justify-center pt-20">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-800 mb-6">
            {error instanceof Error ? error.message : 'The product you are looking for does not exist.'}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-gray-900 rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const parsedSpecs = parseSpecs(product.specs);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white pt-24 pb-12">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-white border border-red-600/20">
              <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                <LazyImage
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full text-gray-900 hover:bg-white/70 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full text-gray-900 hover:bg-white/70 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Image indicators */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-red-500'
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail images */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-red-500'
                        : 'border-transparent hover:border-red-600/50'
                    }`}
                  >
                    <LazyImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-red-600/20 text-red-500 text-sm font-medium rounded-full">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="text-gray-800 text-sm">{product.brand}</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-gray-800 text-sm">
                  {product.rating.toFixed(1)} rating
                </span>
              </div>
            </div>

            <div className="border-t border-b border-red-200 py-6">
              <span className="text-4xl font-bold text-red-500">
                ₹{product.price.toLocaleString()}
              </span>
            </div>

            <div className="space-y-4">
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-800 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                {parsedSpecs.length > 0 && (
                  <div className="bg-white/50 rounded-lg overflow-hidden border border-red-200">
                    <table className="w-full">
                      <tbody>
                        {parsedSpecs.map((spec, index) => (
                          <tr key={index} className={index !== parsedSpecs.length - 1 ? 'border-b border-red-200' : ''}>
                            {spec.key && (
                              <td className="px-4 py-3 text-gray-800 text-sm font-medium w-1/3">
                                {spec.key}
                              </td>
                            )}
                            <td className={`px-4 py-3 text-gray-900 text-sm ${spec.key ? '' : 'col-span-2'}`}>
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Package size={20} className="text-red-500" />
                <span className={`text-sm font-medium ${
                  product.inStock ? 'text-green-400' : 'text-red-400'
                }`}>
                  {product.inStock 
                    ? product.stockQuantity !== null 
                      ? `In Stock (${product.stockQuantity} units available)`
                      : 'In Stock'
                    : 'Out of Stock'
                  }
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() =>
                  addToCart({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.images[0],
                  })
                }
                disabled={!product.inStock}
                className={`w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all ${
                  product.inStock
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-gray-900 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-600/25'
                    : 'bg-red-100 text-gray-800 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={22} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related <span className="text-red-500">Products</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/products/${relatedProduct._id}`}
                    className="group block bg-gradient-to-br from-white to-white border border-red-600/20 rounded-xl overflow-hidden hover:border-red-600/50 transition-all"
                  >
                    <div className="aspect-square overflow-hidden">
                      <LazyImage
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-gray-900 font-semibold truncate mb-1">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-gray-800 text-sm truncate mb-2">
                        {relatedProduct.specs}
                      </p>
                      <span className="text-red-500 font-bold">
                        ₹{relatedProduct.price.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ✅ THIS LINE FIXES VERCEL */
export default ProductDetail;

