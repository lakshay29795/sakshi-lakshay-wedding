import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<Element>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '50px',
    triggerOnce = false
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<Element>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setEntry(entry);
      
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        
        // If triggerOnce is true, disconnect after first intersection
        if (triggerOnce && observerRef.current && ref.current) {
          observerRef.current.unobserve(ref.current);
        }
      } else if (!triggerOnce) {
        setIsIntersecting(false);
      }
    },
    [triggerOnce]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create observer
    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold,
      root,
      rootMargin,
    });

    // Start observing
    observerRef.current.observe(element);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, root, rootMargin, handleIntersect]);

  return {
    ref,
    isIntersecting,
    entry,
  };
}

// Hook specifically for lazy loading images
export function useLazyImage(src: string, options?: UseIntersectionObserverOptions) {
  const { ref, isIntersecting } = useIntersectionObserver({
    triggerOnce: true,
    ...options,
  });
  
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isIntersecting && src && !imageSrc) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoaded(false);
  }, []);

  return {
    ref,
    src: imageSrc,
    isLoaded,
    isError,
    isIntersecting,
    onLoad: handleLoad,
    onError: handleError,
  };
}
