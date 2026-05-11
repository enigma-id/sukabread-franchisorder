import { ShoppingCart, Plus, Minus } from "lucide-react";
import type { CatalogItem } from "../../services/types/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { currencyFormat } from "@/utils";

interface ProductCardProps {
  product: CatalogItem;
  onAdd: (product: CatalogItem, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const { catalog } = product;
  const [quantity, setQuantity] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group bg-white rounded-[2rem] p-3 border border-base-200 premium-shadow flex flex-col gap-3 transition-all duration-300 hover:border-primary/20"
    >
      {/* Image Container - Square Widget Style */}
      <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-base-100">
        <img
          src={catalog.image || "https://placehold.co/400x400?text=SukaBread"}
          alt={catalog.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Bundle Badge - Top Left */}
        {catalog.is_bundle === 1 && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-primary/90 px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <span className="text-[7px] font-black text-white uppercase tracking-tighter">
                BUNDLE
              </span>
            </div>
          </div>
        )}

        {/* Action Overlay - subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info Section */}
      <div className="flex flex-col px-1 flex-1">
        <h3 className="text-[14px] font-black text-base-content leading-tight uppercase tracking-tight line-clamp-2">
          {catalog.name}
        </h3>

        {catalog.description && (
          <p className="text-[11px] font-medium text-base-content/50 mt-1.5 line-clamp-2 leading-relaxed h-[2.8em]">
            {catalog.description}
          </p>
        )}

        <div className="mt-2">
          <span className="text-base font-black text-primary italic leading-none">
            {currencyFormat(catalog.unit_price)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] font-bold text-base-content/20 uppercase tracking-widest truncate max-w-[60%]">
            {catalog.code}
          </span>
          <span className="text-[10px] font-black text-primary/30">
            {(catalog.weight / 1000).toFixed(1)}kg
          </span>
        </div>

        {/* Action Controls - Smart Widget Style */}
        <div className="mt-auto pt-3">
          <div className="flex flex-col @[180px]:flex-row gap-2">
            <div className="flex flex-1 items-center justify-between bg-base-200/50 p-1 rounded-[1.25rem] border border-base-200/50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base-content/30 hover:text-primary transition-colors active:scale-90"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="text-[12px] font-black text-base-content w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base-content/30 hover:text-primary transition-colors active:scale-90"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>

            <button
              onClick={() => {
                onAdd(product, quantity);
                setQuantity(1);
              }}
              className="flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-4 py-2.5 shadow-lg shadow-primary/20 active:scale-95 transition-all hover:brightness-110 min-w-[44px]"
            >
              <ShoppingCart size={16} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-widest block @[180px]:hidden">
                Add to Cart
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
