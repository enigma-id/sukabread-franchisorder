/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useRef, useState } from "react";
import { useCatalog } from "../services/catalog/hooks";
import { useCart } from "../services/cart/hooks";
import { PackageX } from "lucide-react";
import StickyHeader from "../components/app/StickyHeader";
import ProductCard from "../components/app/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import type { CatalogItem } from "@/services/types/catalog";

const CatalogScreen = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { listQuery } = useCatalog({ params });
  const { addItem } = useCart();
  const { data: catalogResponse, isLoading, isFetching } = listQuery;

  const handleAddToCart = (product: CatalogItem, quantity: number) => {
    addItem(product, quantity);
  };

  useEffect(() => {
    if (!catalogResponse) return;
    const incoming: CatalogItem[] = catalogResponse.data || [];
    setProducts((prev) => {
      if (params.page === 1) return incoming;
      const seen = new Set(prev.map((product) => product.id));
      return [...prev, ...incoming.filter((product) => !seen.has(product.id))];
    });
    setHasMore(Boolean(catalogResponse.meta?.has_next));
  }, [catalogResponse, params.page]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching) {
          setParams((prev) => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProducts([]);
    setHasMore(true);
    setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  if (isLoading && params.page === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary/10 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="mt-6 font-black uppercase tracking-[0.3em] text-[10px] text-primary">
          SukaBread
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pb-32">
      <StickyHeader
        searchPlaceholder="Search products..."
        searchValue={params.search}
        onSearchChange={handleSearch}
        isFetching={isFetching}
      />

      <div className="px-4 pt-4 pb-20 max-w-lg mx-auto">
        {/* Products */}
        <AnimatePresence mode="wait">
          {products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-3"
            >
              {products.map((product: CatalogItem, index: number) => (
                <ProductCard
                  key={product?.id || `product-${index}`}
                  product={product}
                  onAdd={handleAddToCart}
                />
              ))}
            </motion.div>
          ) : (
            !isFetching && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-base-300"
              >
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-inner mb-6">
                  <PackageX size={40} className="text-base-content/20" />
                </div>
                <h3 className="text-lg font-black tracking-tight uppercase text-base-content">
                  No products found
                </h3>
                <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest mt-2">
                  Adjust your filters
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Load more */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isFetching && (
              <span className="loading loading-spinner loading-md text-primary" />
            )}
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="flex items-center gap-3 py-8">
            <div className="h-px flex-1 bg-base-300" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-base-content/30">
              End of list
            </span>
            <div className="h-px flex-1 bg-base-300" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogScreen;
