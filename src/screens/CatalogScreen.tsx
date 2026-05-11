import React, { useState } from "react";
import { useCatalog } from "../services/catalog/hooks";
import { useCart } from "../services/cart/hooks";
import type { CatalogItem } from "../services/types/api";
import { PackageX, ChevronLeft, ChevronRight } from "lucide-react";
import StickyHeader from "../components/app/StickyHeader";
import ProductCard from "../components/app/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

const CatalogScreen = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    order_by: "catalog_id__name",
  });

  const { query } = useCatalog(params);
  const { addItem } = useCart();
  const { data: catalogResponse, isLoading, isFetching } = query;

  const handleAddToCart = (product: CatalogItem, quantity: number) => {
    addItem(product, quantity);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
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

  const products = catalogResponse?.data || [];
  const meta = catalogResponse?.meta;

  return (
    <div className="min-h-screen bg-base-200 pb-32">
      <StickyHeader
        searchPlaceholder="Search products..."
        searchValue={params.search}
        onSearchChange={handleSearch}
        isFetching={isFetching}
      />

      <div className="px-6 pt-6 pb-24 max-w-lg mx-auto">
        {/* Categories / Sections */}
        <AnimatePresence mode="wait">
          {products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.catalog.id || `product-${index}`}
                  product={product}
                  onAdd={handleAddToCart}
                />
              ))}
            </motion.div>
          ) : (
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
          )}
        </AnimatePresence>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between mt-12 mb-8 bg-white/60 p-2 rounded-2xl">
            <button
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-base-content/40 disabled:opacity-30 active:scale-95 transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em]">
                Page
              </span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-primary">
                  {meta.current_page}
                </span>
                <span className="text-sm font-black text-base-content/30">
                  /
                </span>
                <span className="text-sm font-black text-base-content/50">
                  {meta.last_page}
                </span>
              </div>
            </div>

            <button
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-base-content/40 disabled:opacity-30 active:scale-95 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogScreen;
