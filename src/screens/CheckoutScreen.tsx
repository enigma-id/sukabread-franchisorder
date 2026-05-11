import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { PaymentMethod } from "../services/cart/api";
import {
  Trash2,
  Plus,
  Minus,
  Calendar,
  Wallet,
  ArrowRight,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "../components/app/SectionTitle";
import { currencyFormat, dateFormat } from "@/utils";
import { useEnigmaUI } from "@/components";
import { useCart } from "../services/cart/hooks";
import StickyHeader from "@/components/app/StickyHeader";

const CheckoutScreen = () => {
  const { showToast } = useEnigmaUI();
  const {
    doCheckout,
    doFetchSchedule,
    getScheduleResult,
    checkoutResult,
    paymentMethodsQuery,
    items,
    total,
    updateQuantity,
    removeItem,
  } = useCart();

  const navigate = useNavigate();
  const [shippingDate, setShippingAt] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phone, setPhone] = useState("");

  const { data: paymentMethodsData } = paymentMethodsQuery;
  const paymentMethods = (
    Array.isArray(paymentMethodsData)
      ? paymentMethodsData
      : (paymentMethodsData as any)?.data || []
  ) as PaymentMethod[];

  const { data: scheduleResponse, isLoading: isFetchingSchedule } =
    getScheduleResult;

  const availableDates = scheduleResponse?.schedules || null;
  const selectedSchedule = availableDates?.find((s) => s.date === shippingDate);
  const shippingCost = selectedSchedule?.cost || 0;
  const grandTotal = (total || 0) + shippingCost;

  const isCheckingOut = checkoutResult.isLoading;

  const selectedPaymentMethod = paymentMethods.find(
    (pm) => pm.id === paymentMethod,
  );
  const requiresPhone = selectedPaymentMethod?.is_payment_gateway === 1;

  const handleFetchSchedule = async () => {
    await doFetchSchedule();
  };

  // Auto fetch schedule when items change
  useEffect(() => {
    if (items.length > 0) {
      handleFetchSchedule();
    }
  }, [items.length]);
  const handleCheckout = async () => {
    if (!paymentMethod || !shippingDate) {
      showToast({
        message: "Please select payment method and delivery date",
        type: "warning",
      });
      return;
    }

    if (requiresPhone && !phone) {
      showToast({
        message: "Please enter your phone number for digital wallet payment",
        type: "warning",
      });
      return;
    }

    try {
      const result = await doCheckout({
        payment_method: {
          bank_id: paymentMethod,
          phone: requiresPhone ? phone : undefined,
        },
        shipping_at: dateFormat(shippingDate, "YYYY-MM-DD"),
      });
      if (result?.id) {
        navigate(`/order/${result.id}`);
      }
    } catch (err: any) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pb-40">
      <StickyHeader showSearch={false} />

      <div className="px-6 pt-6 max-w-lg mx-auto">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-8 bg-white rounded-[3rem] border border-base-200 shadow-sm"
          >
            <div className="w-24 h-24 rounded-[2.5rem] bg-base-100 flex items-center justify-center mb-8 border border-base-200">
              <ShoppingBag size={48} className="text-base-content/20" />
            </div>
            <h3 className="text-xl font-black text-base-content tracking-tight uppercase">
              Basket is empty
            </h3>
            <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest mt-3 max-w-[220px] text-center leading-relaxed">
              Your bread journey begins in the catalog.
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-10 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              Explore Catalog
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Cart Items Section */}
            <section>
              <SectionTitle
                title="SELECTED ITEMS"
                subtitle="Review your order"
              />
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      key={item.catalog.id}
                      className="relative bg-white rounded-3xl p-4 flex items-center gap-4 premium-shadow group border border-transparent hover:border-primary/20 transition-all"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-base-100 overflow-hidden shrink-0 border border-base-200">
                        <img
                          src={item.catalog.image}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={item.catalog.name}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black uppercase tracking-tight truncate text-base-content">
                          {item.catalog.name}
                        </h3>
                        <p className="text-[11px] font-black text-primary mt-0.5 italic">
                          {currencyFormat(item.catalog.unit_price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 bg-base-100 p-1 rounded-xl border border-base-200 shadow-inner">
                          <button
                            onClick={() =>
                              updateQuantity(item.catalog.id, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-base-content/40 hover:text-primary transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-base-content">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.catalog.id, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-base-content/40 hover:text-primary transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.catalog.id)}
                          className="text-[9px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={10} /> Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* Delivery & Payment Section */}
            <section className="space-y-6">
              <SectionTitle
                title="CHECKOUT DETAILS"
                subtitle="Fulfillment info"
              />

              <div className="grid grid-cols-1 gap-4">
                {/* Delivery Date */}
                <div className="bg-white rounded-3xl p-6 border border-base-200 premium-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                      <Calendar className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                        Delivery Date
                      </h3>
                      <p className="text-sm font-black text-base-content uppercase tracking-tight">
                        Select your schedule
                      </p>
                    </div>
                  </div>

                  {isFetchingSchedule && !availableDates ? (
                    <div className="w-full h-48 bg-base-100 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 border border-base-100 shadow-inner">
                      <span className="loading loading-spinner loading-lg text-primary" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 animate-pulse">
                        Calculating Schedule...
                      </p>
                    </div>
                  ) : !availableDates ? (
                    <div className="w-full h-48 bg-base-50/50 rounded-3xl border-2 border-dashed border-base-200 flex flex-col items-center justify-center p-6 text-center">
                      <ShoppingBag
                        className="text-base-content/10 mb-2"
                        size={32}
                      />
                      <p className="text-xs font-bold text-base-content/30">
                        Add items to see available delivery dates
                      </p>
                    </div>
                  ) : availableDates.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-base-100/50 border-2 border-dashed border-base-200 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 mb-1">
                        No Slots Available
                      </p>
                      <p className="text-xs text-base-content/50">
                        Try adjusting your cart items or contact support.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Month Header */}
                      <div className="flex items-center justify-between px-1 mb-2">
                        <span className="text-xs font-black text-base-content uppercase tracking-widest">
                          {dayjs(availableDates[0].date).format("MMMM YYYY")}
                        </span>
                        <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                          {availableDates.length} Slots
                        </span>
                      </div>

                      {/* Calendar Grid */}
                      <div className="bg-base-200/30 rounded-3xl p-3">
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                            (d) => (
                              <span
                                key={d}
                                className="text-[8px] font-black uppercase text-base-content/30"
                              >
                                {d}
                              </span>
                            ),
                          )}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {(() => {
                            const firstDate = dayjs(
                              availableDates[0].date,
                            ).startOf("month");
                            const lastDate = dayjs(
                              availableDates[0].date,
                            ).endOf("month");
                            const days = [];

                            // Padding for start of month
                            for (let i = 0; i < firstDate.day(); i++) {
                              days.push(<div key={`pad-${i}`} />);
                            }

                            // Days of month
                            for (let d = 1; d <= lastDate.date(); d++) {
                              const currentDay = firstDate.date(d);
                              const dateStr = currentDay.format("YYYY-MM-DD");

                              // Check if this date is available (ignoring time in comparison)
                              const scheduleItem = availableDates.find(
                                (s) =>
                                  dayjs(s.date).format("YYYY-MM-DD") ===
                                  dateStr,
                              );

                              const isSelected =
                                shippingDate &&
                                dayjs(shippingDate).format("YYYY-MM-DD") ===
                                  dateStr;

                              days.push(
                                <button
                                  key={d}
                                  disabled={!scheduleItem}
                                  onClick={() =>
                                    setShippingAt(scheduleItem!.date)
                                  }
                                  className={`relative flex flex-col items-center justify-center py-2 rounded-xl transition-all ${
                                    scheduleItem
                                      ? isSelected
                                        ? "bg-primary text-white shadow-md scale-105 z-10"
                                        : "bg-white hover:border-primary/50 border border-transparent text-base-content shadow-sm"
                                      : "opacity-20 text-base-content/50 pointer-events-none"
                                  }`}
                                >
                                  <span className="text-[10px] font-black">
                                    {d}
                                  </span>
                                  {scheduleItem && (
                                    <span
                                      className={`text-[6px] font-bold mt-0.5 ${isSelected ? "text-white/80" : "text-primary"}`}
                                    >
                                      {scheduleItem.cost / 1000}k
                                    </span>
                                  )}
                                </button>,
                              );
                            }
                            return days;
                          })()}
                        </div>
                      </div>

                      {/* Selection Hint */}
                      {!shippingDate ? (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] text-center font-medium text-base-content/40 italic"
                        >
                          Tap a highlighted date to select delivery
                        </motion.p>
                      ) : (
                        selectedSchedule && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                <Truck size={18} className="text-primary" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">
                                  Selected Delivery
                                </p>
                                <p className="text-xs font-bold text-base-content">
                                  {selectedSchedule.date_string}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">
                                Fee
                              </p>
                              <p className="text-sm font-black text-primary">
                                {currencyFormat(selectedSchedule.cost)}
                              </p>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-3xl p-6 border border-base-200 premium-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Wallet className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
                        Payment Method
                      </h3>
                      <p className="text-sm font-black text-base-content uppercase tracking-tight">
                        How will you pay?
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {paymentMethods?.map((pm) => (
                      <div key={pm.id} className="flex flex-col gap-2">
                        <button
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                            paymentMethod === pm.id
                              ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                              : "border-base-100 bg-base-100/50 hover:border-base-300"
                          }`}
                        >
                          <span className="text-xs font-black text-base-content uppercase">
                            {pm.name}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              paymentMethod === pm.id
                                ? "border-primary bg-primary"
                                : "border-base-300"
                            }`}
                          >
                            {paymentMethod === pm.id && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </div>
                        </button>

                        {/* Phone Input for E-Wallets */}
                        <AnimatePresence>
                          {paymentMethod === pm.id &&
                            pm.is_payment_gateway === 1 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 mt-1">
                                  <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">
                                    {pm.name} Phone Number
                                  </p>
                                  <input
                                    type="tel"
                                    placeholder="e.g. 08123456789"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-white border border-base-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                  />
                                  <p className="text-[8px] text-base-content/40 mt-2 italic">
                                    Please ensure this number is registered with{" "}
                                    {pm.name}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Floating Checkout Footer */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-24 left-0 right-0 px-6 z-40"
            >
              <div className="max-w-md mx-auto bg-white rounded-[2.5rem] p-4 pr-4 shadow-2xl border border-base-200 flex items-center justify-between overflow-hidden relative">
                {/* Pattern */}
                <div className="absolute inset-0 pattern-dots opacity-10 pointer-events-none" />

                <div className="relative z-10 pl-4">
                  <span className="text-[10px] font-black text-base-content/20 uppercase tracking-widest block mb-1">
                    {shippingCost > 0
                      ? `Inc. ${currencyFormat(shippingCost)} Fee`
                      : "Grand Total"}
                  </span>
                  <span className="text-2xl font-black text-base-content tracking-tighter italic">
                    {currencyFormat(grandTotal)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !paymentMethod || !shippingDate}
                  className="relative z-10 h-16 px-8 bg-primary text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-3"
                >
                  {isCheckingOut ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      Checkout <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutScreen;
