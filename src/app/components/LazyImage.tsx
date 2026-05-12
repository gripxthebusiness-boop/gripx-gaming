import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;              // full image URL
  alt: string;
  className?: string;
  placeholderSrc?: string;  // optional tiny blurred placeholder
  webpSrc?: string;         // optional WebP version for better compression
}

export function LazyImage({
  src,
  alt,
  className = '',
  placeholderSrc,
  webpSrc,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for lazy-loading
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safe

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            obs.unobserve(entry.target); // safer than disconnect
          }
        });
      },
      { rootMargin: '100px' } // Start loading 100px before entering viewport
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  // Determine which image format to use (WebP preferred for smaller size)
  useEffect(() => {
    if (isInView) {
      // Try WebP first if available, fall back to regular src
      if (webpSrc) {
        setImageSrc(webpSrc);
      } else {
        setImageSrc(src);
      }
    }
  }, [isInView, src, webpSrc]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder: either blurred image or pulse */}
      {!isLoaded && (
        placeholderSrc ? (
          <img
            src={placeholderSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-105 animate-fade"
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 bg-red-50 animate-pulse" />
        )
      )}

      {/* Actual Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
export default LazyImage;