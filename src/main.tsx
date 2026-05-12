
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, Component } from "react";
import App from "./app/App.tsx";
import "./styles/index.css";

// Register Service Worker for offline support and caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      // Service worker registration failed, app will still work online
    });
  });
}

// Error boundary to catch rendering errors
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-red-500/30 rounded-xl p-6">
            <h1 className="text-xl font-bold text-red-400 mb-4">Application Error</h1>
            <p className="text-gray-900 mb-4">
              {this.state.error?.message || 'An unknown error occurred'}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
              className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            >
              Clear Cache & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Create a QueryClient with optimized settings for faster data loading
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - longer cache for products
      gcTime: 60 * 60 * 1000, // 1 hour garbage collection
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Single retry on failure
      refetchOnReconnect: 'stale', // Refetch stale data when reconnecting
      throwOnError: false, // Don't throw on error, handle gracefully
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ErrorBoundary>
);
  