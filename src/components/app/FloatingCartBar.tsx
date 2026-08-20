import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../services/cart/hooks";
import { currencyFormat } from "../../utils";

const FloatingCartBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, total } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Don't show on checkout page or if cart is empty
  if (location.pathname !== "/" || cartCount === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className='fixed bottom-28 left-0 right-0 px-4 z-40 pointer-events-none'
      >
        <button
          onClick={() => navigate("/checkout")}
          className='w-full max-w-md mx-auto bg-primary text-white p-3 rounded-2xl shadow-[0_20px_50px_rgba(52,73,94,0.3)] flex items-center justify-between px-6 pointer-events-auto active:scale-95 transition-all group'
        >
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md'>
              <span className='text-xs font-black'>{cartCount}</span>
            </div>
            <div className='flex flex-col items-start'>
              <span className='text-[9px] font-black uppercase tracking-widest opacity-60'>
                Your Basket
              </span>
              <span className='text-xs font-black tracking-tight'>
                {currencyFormat(total)}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='text-[9px] font-black uppercase tracking-widest'>
              Checkout
            </span>
            <ChevronRight
              size={14}
              strokeWidth={3}
              className='group-hover:translate-x-1 transition-transform'
            />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingCartBar;
