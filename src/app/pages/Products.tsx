import { motion } from 'framer-motion';
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    productsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function Products() {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();

  // Use React Query for caching and automatic refetching
  const { data, isLoading, error, isFetching } = useQuery<ProductsResponse>({
    queryKey: ['products', activeFilter, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
      });

      if (activeFilter !== 'All') {
        params.append('category', activeFilter);
      }

      const response = await fetch(`${API_BASE}/products?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const products = data?.products || [];
  const pagination = data?.pagination;

  const nextImage = (productId: string, images: string[]) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % images.length,
    }));
  };

  const prevImage = (productId: string, images: string[]) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]:
        prev[productId] === 0
          ? images.length - 1
          : (prev[productId] || 0) - 1,
    }));
  };

  const categories = ['All', 'Mice', 'Keyboards', 'Headsets', 'Controllers'];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    setCurrentPage(1);
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cyan-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Premium
            </span>{' '}
            Gaming Gear
          </h1>
          <p className="text-gray-400 text-lg">
            Curated gaming gear from trusted brands in India
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-200">
            {error instanceof Error ? error.message : 'Unable to load products right now.'}
          </div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-gray-900 text-gray-400 border border-cyan-500/20 hover:border-cyan-500/50'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Loading overlay when fetching new data */}
        {isFetching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-center"
          >
            Updating products...
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const currentImageIndex = currentImageIndexes[product._id] || 0;
            const currentImage = product.images?.[currentImageIndex] || '';

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Link
                  to={`/products/${product._id}`}
                  className="block relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            prevImage(product._id, product.images);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full z-10"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            nextImage(product._id, product.images);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full z-10"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl text-cyan-400 font-bold">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            image: product.images[0],
                          });
                        }}
                        disabled={!product.inStock}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                          product.inStock
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart size={18} />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
          {!products.length && !isLoading && (
            <div className="col-span-full text-center text-gray-400 py-12">
              No products found in this category.
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-900 text-gray-400 border border-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-500/50 transition-all"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number;
              const current = pagination.currentPage;
              const total = pagination.totalPages;
              
              if (total <= 5) {
                pageNum = i + 1;
              } else if (current <= 3) {
                pageNum = i + 1;
              } else if (current >= total - 2) {
                pageNum = total - 4 + i;
              } else {
                pageNum = current - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'bg-gray-900 text-gray-400 border border-cyan-500/20 hover:border-cyan-500/50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 rounded-lg bg-gray-900 text-gray-400 border border-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-500/50 transition-all"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Products count */}
        {pagination && (
          <p className="text-center text-gray-500 mt-6">
            Showing {products.length} of {pagination.totalProducts} products
          </p>
        )}
      </div>
    </div>
  );
}

/* ✅ THIS LINE FIXES VERCEL */
export default Products;

