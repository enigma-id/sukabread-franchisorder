import { useParams, useNavigate } from "react-router-dom";
import { useOrderDetail } from "../services/order/hooks";
import {
  ArrowLeft,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  ChevronLeft,
  Package,
  Receipt,
  Truck,
  Timer,
  Copy,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEnigmaUI, Modal, Input } from "../components";
import SectionTitle from "../components/app/SectionTitle";
import { useState, useEffect } from "react";
import { currencyFormat, dateFormat } from "../utils";

const CancelOrderModal = ({ onConfirm, onClose, isPending }: any) => {
  const [reason, setReason] = useState("");
  return (
    <Modal.Wrapper open={true} onClose={onClose}>
      <Modal.Header>Cancel Order</Modal.Header>
      <Modal.Body>
        <div className="py-4">
          <Input
            label="Reason for cancellation"
            value={reason}
            onChange={(e: any) => setReason(e.target.value)}
            placeholder="e.g. Changed my mind"
            className="w-full"
          />
          <p className="text-[10px] font-bold text-base-content/40 uppercase mt-4 italic">
            * This action cannot be undone.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-3 w-full">
          <button
            className="flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-base-200 hover:bg-base-100 transition-all"
            onClick={onClose}
          >
            Go Back
          </button>
          <button
            className="flex-1 h-12 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
            disabled={!reason || isPending}
            onClick={() => onConfirm(reason)}
          >
            {isPending ? "Processing..." : "Confirm Void"}
          </button>
        </div>
      </Modal.Footer>
    </Modal.Wrapper>
  );
};

const OrderDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal, closeModal } = useEnigmaUI();
  const { query, doCancelOrder, cancelOrderResult } = useOrderDetail(
    id as string,
  );
  const { data: order, isLoading, error } = query;
  const isCanceling = cancelOrderResult.isLoading;
  const { showToast } = useEnigmaUI();

  const [timeLeft, setTimeLeft] = useState<any>(null);

  useEffect(() => {
    const expiryDate = order?.payment_expired_at;
    if (expiryDate) {
      const timer = setInterval(() => {
        const difference = +new Date(expiryDate) - +new Date();
        if (difference > 0) {
          setTimeLeft({
            h: Math.floor((difference / (1000 * 60 * 60)) % 24),
            m: Math.floor((difference / 1000 / 60) % 60),
            s: Math.floor((difference / 1000) % 60),
          });
        } else {
          setTimeLeft(null);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [order?.payment_expired_at]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      message: `${label} copied to clipboard!`,
      type: "success",
      position: "top-center",
    });
  };

  const handleCancelOrder = () => {
    openModal({
      id: "cancel-order",
      content: (
        <CancelOrderModal
          onConfirm={async (reason: string) => {
            await doCancelOrder(reason);
            closeModal("cancel-order");
          }}
          onClose={() => closeModal("cancel-order")}
          isPending={isCanceling}
        />
      ),
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          Loading Details
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-base-200 p-6 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <AlertCircle className="text-red-500" size={40} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight mb-2">
          Order Not Found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost text-primary font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "finished":
      case "completed":
        return "text-green-500 bg-green-50";
      case "pending":
      case "active":
        return "text-orange-500 bg-orange-50";
      case "void":
      case "canceled":
        return "text-red-500 bg-red-50";
      default:
        return "text-blue-500 bg-blue-50";
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pb-80">
      <header className="sticky top-0 z-40 bg-base-200/80 backdrop-blur-xl px-6 py-6 border-b border-white/20">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-base-content/40 active:scale-95 transition-all border border-base-200"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-black tracking-tighter text-primary leading-none uppercase">
              SUKABREAD
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-4 bg-primary/20" />
              <p className="text-[10px] font-black text-base-content/30 tracking-[0.3em] uppercase">
                Franchise Portal
              </p>
              <div className="h-px w-4 bg-primary/20" />
            </div>
          </div>

          <div className="w-10 h-10" />
        </div>
      </header>

      <div className="px-6 pt-6 max-w-lg mx-auto">
        {/* Main Order Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 border border-base-200 premium-shadow mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 pattern-dots opacity-10 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest">
                  Order ID
                </span>
                <span className="text-lg font-black text-base-content font-mono">
                  {order.code}
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm ${getStatusColor(order.order_status)}`}
              >
                {order.order_status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10 px-8 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-base-100 flex items-center justify-center text-primary border border-base-200">
                <Calendar size={18} />
              </div>
              <div>
                <span className="text-[9px] font-black text-base-content/40 uppercase">
                  Ordered on
                </span>
                <span className="text-xs font-black text-base-content block">
                  {dateFormat(order.ordered_at, "DD MMM YYYY")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-base-100 flex items-center justify-center text-primary border border-base-200">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[9px] font-black text-base-content/40 uppercase">
                  At time
                </span>
                <span className="text-xs font-black text-base-content block">
                  {dateFormat(order.ordered_at, "HH:mm")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Info Section */}
        {(order.bank || order.payment_url || order.payment_expired_at) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] p-6 border border-base-200 premium-shadow mb-6 relative overflow-hidden"
          >
            {/* Expiry Countdown */}
            {timeLeft && (
              <div className="relative overflow-hidden bg-primary rounded-2xl mb-6 p-4 shadow-xl shadow-primary/20">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none pattern-dots" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <Timer size={20} className="animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">
                        PAYMENT EXPIRES IN
                      </span>
                      <span className="text-[8px] font-bold text-white/70 uppercase tracking-widest">
                        Complete payment before time runs out
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white font-mono tabular-nums leading-none">
                        {timeLeft.h.toString().padStart(2, "0")}
                      </span>
                      <span className="text-[8px] font-bold text-white/50 uppercase mt-1">
                        HRS
                      </span>
                    </div>
                    <span className="text-xl font-black text-white/30 mb-4">
                      :
                    </span>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white font-mono tabular-nums leading-none">
                        {timeLeft.m.toString().padStart(2, "0")}
                      </span>
                      <span className="text-[8px] font-bold text-white/50 uppercase mt-1">
                        MIN
                      </span>
                    </div>
                    <span className="text-xl font-black text-white/30 mb-4">
                      :
                    </span>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white font-mono tabular-nums leading-none">
                        {timeLeft.s.toString().padStart(2, "0")}
                      </span>
                      <span className="text-[8px] font-bold text-white/50 uppercase mt-1">
                        SEC
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Receipt size={18} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                    Payment Method
                  </h3>
                  <p className="text-sm font-black text-base-content uppercase">
                    {order.bank?.name || "Digital Payment"}
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest ${getStatusColor(order.payment_status)}`}
              >
                {order.payment_status}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Account Number */}
              <button
                onClick={() => {
                  if (order.is_payment_gateway === 0) {
                    handleCopy(
                      order.bank?.account_number || "",
                      "Account Number",
                    );
                  }
                }}
                className={`group flex flex-col bg-base-100 rounded-2xl p-4 border border-base-200 transition-all text-left ${order.is_payment_gateway === 0 ? "hover:border-primary/30" : "cursor-default"}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-base-content/40 uppercase">
                    {order.is_payment_gateway === 0
                      ? "Account Number"
                      : "Payment Method Type"}
                  </span>
                  {order.is_payment_gateway === 0 && (
                    <Copy
                      size={12}
                      className="text-primary opacity-0 group-hover:opacity-100 transition-all"
                    />
                  )}
                </div>
                <span
                  className={`text-sm font-black font-mono tracking-wider ${order.is_payment_gateway === 0 ? "text-primary" : "text-base-content"}`}
                >
                  {order.is_payment_gateway === 0
                    ? order.bank?.account_number || "-"
                    : "Digital Payment Gateway"}
                </span>
              </button>

              {/* Account Name */}
              <div className="flex flex-col bg-base-100 rounded-2xl p-4 border border-base-200 text-left">
                <span className="text-[10px] font-bold text-base-content/40 uppercase mb-1">
                  Account Name
                </span>
                <span className="text-sm font-black text-base-content uppercase">
                  {order.bank?.account_name}
                </span>
              </div>

              {/* Total Bill to Copy */}
              <button
                onClick={() =>
                  handleCopy(order.total_bill.toString(), "Total Bill")
                }
                className="group flex flex-col bg-base-100 rounded-2xl p-4 border border-base-200 hover:border-primary/30 transition-all text-left"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-base-content/40 uppercase">
                    Total Amount to Pay
                  </span>
                  <Copy
                    size={12}
                    className="text-primary opacity-0 group-hover:opacity-100 transition-all"
                  />
                </div>
                <span className="text-lg font-black text-base-content">
                  {currencyFormat(order.total_bill, true, "Rp", "0")}
                </span>
              </button>

              {/* Action Buttons */}
              <div className="mt-4">
                {order.is_payment_gateway === 0 ? (
                  <a
                    href={`https://wa.me/628123456789?text=Hi, I would like to confirm my payment for order ${order.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-14 bg-[#25D366] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <MessageSquare size={18} /> Confirm via WhatsApp
                  </a>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() =>
                        window.open(order.payment_url || "", "_blank")
                      }
                      className="w-full h-14 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <ExternalLink size={18} /> Open Payment Link
                    </button>
                    <button
                      onClick={() =>
                        handleCopy(order.payment_url || "", "Payment Link")
                      }
                      className="flex items-center justify-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest hover:opacity-70 transition-all"
                    >
                      <Copy size={12} /> Copy Payment Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Shipping Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-[2rem] p-6 border border-base-200 premium-shadow mb-8"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Truck size={18} />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                  Logistics Detail
                </h3>
                <p className="text-sm font-black text-base-content uppercase">
                  {order.expedisi || "Standard Shipping"}
                </p>
              </div>
            </div>
            <div
              className={`px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest ${getStatusColor(order.delivery_status)}`}
            >
              {order.delivery_status}
            </div>
          </div>
          <div className="bg-base-100 rounded-2xl p-4 border border-base-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-base-content/40 uppercase">
                Expedition
              </span>
              <span className="text-xs font-black text-base-content">
                {order.expedisi}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-base-content/40 uppercase">
                Est. Shipping Date
              </span>
              <span className="text-xs font-black text-base-content">
                {order.shipping_date
                  ? dateFormat(order.shipping_date, "DD MMMM YYYY")
                  : "To be determined"}
              </span>
            </div>
          </div>
        </motion.div>

        <SectionTitle
          title="ORDER SUMMARY"
          subtitle={`${order.items.length} items purchased`}
        />

        <div className="flex flex-col gap-3 mb-10">
          {order.items.map((item: any, idx: number) => {
            const itemName = item?.catalog?.name || `-- ${item?.item?.name}`;
            const isBundleItem = item.bundle_id > 0;

            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={idx}
                className="bg-white rounded-3xl p-5 flex items-center justify-between premium-shadow border border-transparent hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-base-100 flex items-center justify-center text-primary/40 border border-base-200">
                    <Package size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-base-content uppercase tracking-tight">
                      {itemName}
                    </span>
                    {!isBundleItem && (
                      <span className="text-[10px] font-bold text-base-content/50 uppercase">
                        {item.quantity_ordered} × @{" "}
                        {currencyFormat(item.unit_nett)}
                      </span>
                    )}
                  </div>
                </div>
                {!isBundleItem && (
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-primary italic">
                      {currencyFormat(
                        item.unit_nett * item.quantity_ordered,
                        true,
                        "Rp",
                        "0",
                      )}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Bill Breakdown Card */}
      <div className="fixed bottom-24 left-0 right-0 z-50 px-6">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-base-100/90 backdrop-blur-xl rounded-[2rem] p-6 border-2 border-dashed border-base-300 shadow-2xl max-w-md mx-auto"
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">
                Subtotal
              </span>
              <span className="text-sm font-black text-base-content">
                {currencyFormat(order.subtotal_gross, true, "Rp", "0")}
              </span>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">
                Shipping Charges
              </span>
              <span className="text-sm font-black text-base-content">
                {currencyFormat(order.shipping_charges, true, "Rp", "0")}
              </span>
            </div>
            <div className="h-px bg-base-300 my-1" />
            <div className="flex justify-between items-center px-2 mb-1">
              <span className="text-xs font-black text-base-content uppercase">
                Total Bill
              </span>
              <span className="text-xl font-black text-primary">
                {currencyFormat(order.total_bill, true, "Rp", "0")}
              </span>
            </div>

            {(order?.id || 0) !== 0 && order.order_status === "pending" && (
              <button
                onClick={handleCancelOrder}
                disabled={isCanceling}
                className="w-full h-12 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isCanceling ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <XCircle size={16} /> Void Order
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetailScreen;
