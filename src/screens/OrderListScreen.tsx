import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../services/order/hooks";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight as ChevronIcon,
  Activity,
  Slash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StickyHeader from "../components/app/StickyHeader";
import SectionTitle from "../components/app/SectionTitle";
import { currencyFormat, dateFormat } from "@/utils";

const OrderListScreen = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    status: "",
    order_by: "-id",
  });

  const { query } = useOrder(params);
  const { data, isLoading, isFetching } = query;
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleStatusChange = (status: string) => {
    setParams((prev) => ({ ...prev, status, page: 1 }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          Loading Orders
        </p>
      </div>
    );
  }

  const orders = data?.data || [];
  const meta = data?.meta;

  const getStatusTheme = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "finished":
        return {
          color: "green",
          icon: CheckCircle2,
          text: "Finished",
          wave: "#22c55e",
        };
      case "completed":
        return {
          color: "emerald",
          icon: CheckCircle2,
          text: "Completed",
          wave: "#10b981",
        };
      case "active":
        return {
          color: "blue",
          icon: Activity,
          text: "Active",
          wave: "#3b82f6",
        };
      case "pending":
        return {
          color: "orange",
          icon: Clock,
          text: "Pending",
          wave: "#f97316",
        };
      case "void":
        return {
          color: "slate",
          icon: Slash,
          text: "Void",
          wave: "#64748b",
        };
      case "canceled":
        return {
          color: "red",
          icon: XCircle,
          text: "Canceled",
          wave: "#ef4444",
        };
      default:
        return {
          color: "indigo",
          icon: ClipboardList,
          text: "Order",
          wave: "#6366f1",
        };
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pb-32">
      <StickyHeader showSearch={false}>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar justify-center">
          {["", "pending", "completed", "canceled"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                params.status === status
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-base-content/40 border border-base-200 hover:border-primary/20"
              }`}
            >
              {status === "" ? "All Orders" : status}
            </button>
          ))}
        </div>
      </StickyHeader>

      <div className="px-6 pt-6 max-w-lg mx-auto">
        <SectionTitle
          title="RECENT ACTIVITY"
          subtitle={`${orders.length} orders found`}
        />

        <div className="flex flex-col gap-4 relative">
          <AnimatePresence mode="popLayout">
            {isFetching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 -top-2 flex justify-center z-20"
              >
                <div className="bg-primary text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Updating...
                </div>
              </motion.div>
            )}

            {orders.map((order: any, index) => {
              const theme = getStatusTheme(order.order_status);
              const statusColor = `bg-${theme.color}-500`;
              const bgColor = `bg-${theme.color}-100`;
              const iconColor = `text-${theme.color}-500`;
              const cardBg = `bg-${theme.color}-50/5`;
              const cardBorder = `border-${theme.color}-500/10`;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  key={order.id}
                  onClick={() => navigate(`/order/${order.id}`)}
                  className={`relative overflow-hidden ${cardBg} rounded-3xl border ${cardBorder} p-5 flex items-center justify-between premium-shadow cursor-pointer active:scale-95 transition-all group`}
                >
                  {/* Status Indicator Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${statusColor}`}
                  />

                  <div className="flex items-center gap-5 z-10 min-w-0">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${bgColor}`}
                    >
                      <theme.icon className={iconColor} size={24} />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest truncate">
                        Code:{" "}
                        <span className="font-extrabold text-base-content">
                          {order.code}
                        </span>
                      </span>
                      <span className="text-lg font-black text-base-content tracking-tight mt-0.5">
                        {currencyFormat(order.total_bill)}
                      </span>
                      <span className="text-[9px] font-bold text-base-content/50 mt-1 uppercase">
                        {dateFormat(order.ordered_at, "DD MMM YYYY HH:mm")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 z-10 shrink-0">
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${iconColor}`}
                      >
                        {order.order_status}
                      </span>
                      <div className="w-10 h-1 bg-base-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${statusColor} ${
                            theme.color === "orange"
                              ? "animate-pulse w-1/2"
                              : "w-full"
                          }`}
                        />
                      </div>
                    </div>
                    <ChevronIcon
                      size={20}
                      className="text-base-content/20 group-hover:text-primary transition-colors"
                    />
                  </div>

                  {/* Wave decoration - bottom */}
                  <svg
                    viewBox="0 0 1440 390"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute bottom-0 left-0 w-full h-[50px] pointer-events-none"
                    style={{ opacity: 0.05, transform: "scaleX(-1)" }}
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 0,400 L 0,150 C 36.02,139.67 72.04,129.34 130,138 C 187.96,167.32 267.86,246.64 335,285 C 402.14,323.36 456.52,320.78 522,298 C 587.48,275.22 664.05,232.23 728,232 C 791.95,231.77 843.28,274.29 906,310 C 968.72,345.71 1042.84,374.61 1104,370 C 1165.16,365.39 1213.36,327.27 1276,298 C 1338.64,268.73 1415.72,248.31 1440,238 L 1440,400 Z"
                      fill={theme.wave}
                    />
                  </svg>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {orders.length === 0 && !isFetching && (
            <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-base-300">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-inner mb-6">
                <Search size={40} className="text-base-content/20" />
              </div>
              <h3 className="text-lg font-black tracking-tight uppercase">
                No orders found
              </h3>
              <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest mt-2">
                Try a different filter
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between mt-12 bg-white/60 p-2 rounded-2xl">
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

export default OrderListScreen;
