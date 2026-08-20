import { NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, ClipboardList, Wallet, CreditCard, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../services/store";

const BottomMenu = () => {
  const location = useLocation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const displayCount = cartCount > 99 ? "99+" : cartCount;

  const menuItems = [
    { path: "/", label: "Catalog", icon: ShoppingBag },
    { path: "/orders", label: "Orders", icon: ClipboardList },
    { path: "/wallet", label: "Wallet", icon: Wallet },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-md z-50">
      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white">
        {menuItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path) ||
                (item.path === "/orders" &&
                  location.pathname.startsWith("/order"));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-2 py-3 px-5 rounded-full transition-all duration-500 overflow-hidden ${
                isActive ? "text-white" : "text-base-content/50 hover:text-base-content/70"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative">
                <item.icon size={isActive ? 20 : 22} strokeWidth={isActive ? 3 : 2} className="transition-all" />
                
                {item.hasBadge && cartCount > 0 && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-primary rounded-full border-2 border-white flex items-center justify-center px-1 shadow-lg"
                    >
                      <span className={`text-[8px] font-black leading-none ${isActive ? 'text-primary bg-white rounded-full p-0.5' : 'text-white'}`}>
                        {displayCount}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
              
              {isActive && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomMenu;
