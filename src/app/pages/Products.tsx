import { motion } from 'framer-motion';
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Filter, Check, Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LazyImage } from '../components/LazyImage';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    });
  };

  const { data, isLoading, error, isFetching } = useQuery<ProductsResponse>({
    queryKey: ['products', activeFilter, searchQuery, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (activeFilter !== 'All') {
        params.append('category', activeFilter);
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`${API_BASE}/products?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
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

  const categories = [
    'All',
    'Mice',
    'Keyboards',
    'Headsets',
    'Monitors',
    'Accessories',
    'Controllers',
    'Mousepads',
    'Webcams',
    'Microphones',
    'Speakers',
    'Gaming Chairs',
    'Gaming Desks',
    'Cables & Adapters',
    'VR Headsets',
    'Gamepads',
    'Racing Wheels',
    'Flight Sticks',
    'Capture Cards',
    'Streaming Equipment'
  ];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    setCurrentPage(1);
    setSidebarOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-red-500" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-red-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Mobile filter toggle */}
      <div className="lg:hidden px-4 py-3 bg-white border-b border-gray-200 flex justify-between items-center sticky top-16 z-30">
        <span className="text-gray-800 font-medium">
          {products.length} results{activeFilter !== 'All' ? ` in ${activeFilter}` : ''}
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 lg:px-6">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Department */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Department</h3>
                <ul className="space-y-2">
                  {categories.map(category => (
                    <li key={category}>
                      <button
                        onClick={() => handleFilterChange(category)}
                        className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded transition-colors ${
                          activeFilter === category
                            ? 'bg-red-50 text-red-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {activeFilter === category && <Check size={16} />}
                        <span className={activeFilter === category ? '' : 'ml-6'}>{category}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <aside className={`fixed left-0 top-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-600">
                  <ChevronLeft size={24} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
                <ul className="space-y-2">
                  {categories.map(category => (
                    <li key={category}>
                      <button
                        onClick={() => handleFilterChange(category)}
                        className={`flex items-center gap-2 w-full text-left py-2 px-3 rounded transition-colors ${
                          activeFilter === category
                            ? 'bg-red-50 text-red-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {activeFilter === category && <Check size={16} />}
                        <span className={activeFilter === category ? '' : 'ml-6'}>{category}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Results bar */}
            <div className="hidden lg:flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {activeFilter !== 'All' ? activeFilter : 'All Products'}
                {searchQuery && <span className="text-gray-500 font-normal ml-2">- Search: "{searchQuery}"</span>}
              </h2>
              <span className="text-gray-600">
                {products.length} results
              </span>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-200">
                {error instanceof Error ? error.message : 'Unable to load products right now.'}
              </div>
            )}

            {isFetching && (
              <div className="mb-4 px-4 py-2 rounded-lg bg-red-600/10 text-red-500 text-center text-sm">
                Updating products...
              </div>
            )}

            {/* Product Grid - Amazon style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product, index) => {
                const currentImageIndex = currentImageIndexes[product._id] || 0;
                const currentImage = product.images?.[currentImageIndex] || '';

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <Link to={`/products/${product._id}`} className="block">
                      {/* Image Section */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <LazyImage
                          src={currentImage}
                          alt={product.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                prevImage(product._id, product.images);
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-sm"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                nextImage(product._id, product.images);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-sm"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">{renderStars(product.rating)}</div>
                          <span className="text-xs text-gray-500">({product.rating})</span>
                        </div>

                        {/* Price */}
                        <div className="mb-3">
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{Math.floor(product.price).toLocaleString()}
                          </span>
                          {product.price % 1 !== 0 && (
                            <span className="text-sm text-gray-500 ml-1">
                              {product.price.toFixed(2).split('.')[1]}
                            </span>
                          )}
                        </div>

                        {/* Delivery info */}
                        <div className="text-xs text-gray-500 mb-3">
                          {product.inStock ? (
                            <span className="text-green-600">In Stock</span>
                          ) : (
                            <span className="text-red-500">Currently Unavailable</span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          disabled={!product.inStock}
                          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                            product.inStock
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {!products.length && !isLoading && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No products found in this category.</p>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                
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
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === pageNum
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {/* Results count */}
            {pagination && (
              <p className="text-center text-gray-500 text-sm mt-6">
                Showing {((currentPage - 1) * pagination.productsPerPage) + 1} - {Math.min(currentPage * pagination.productsPerPage, pagination.totalProducts)} of {pagination.totalProducts} results
              </p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Products;