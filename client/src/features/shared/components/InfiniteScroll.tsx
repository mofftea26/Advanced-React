import { useEffect, useRef } from "react";

type InfiniteScrollProps = {
  children: React.ReactNode;
  hasNextPage?: boolean;
  onLoadMore: () => void;
  threshold?: number;
};

export function InfiniteScroll({
  children,
  hasNextPage,
  onLoadMore,
  threshold = 500,
}: InfiniteScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage) {
          onLoadMore();
        }
      },
      {
        rootMargin: `0px 0px ${threshold}px 0px`,
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasNextPage, onLoadMore, threshold]);

  return (
    <div>
      {children}
      <div ref={containerRef} className="h-1" />
    </div>
  );
}
