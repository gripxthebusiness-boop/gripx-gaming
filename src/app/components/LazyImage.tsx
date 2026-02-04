import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;              // full image URL
  alt: string;
  className?: string;
  placeholderSrc?: string;  // optional tiny blurred placeholder
}

export function LazyImage({
  src,
  alt,
  className = '',
  placeholderSrc,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
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
      { rootMargin: '50px' }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder: either blurred image or pulse */}
      {!isLoaded && (
        placeholderSrc ? (
          <img
            src={placeholderSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-105 animate-fade"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}
export default LazyImage;