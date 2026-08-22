/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  Wallet,
  ArrowRight,
  ShoppingBag,
  PlusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import SectionTitle from "../components/app/SectionTitle";
import { currencyFormat } from "@/utils";
import { RemoteSelect, DatePicker } from "@/components";
import { useCart } from "../services/cart/hooks";
import StickyHeader from "@/components/app/StickyHeader";
import type { PaymentMethod } from "@/services/types/payment";
import type { Warehouse } from "@/services/types/warehouse";
import { useAppSelector } from "@/hooks";
import { useProfile } from "@/services/profile/hooks";

type SalesOrderFormData = {
  self_pickup: boolean;
};

const CheckoutScreen = () => {
  const FormState = useAppSelector((s) => s.form);
  const { query: { data: profile } = { data: undefined } } = useProfile();

  const {
    doCheckout,
    checkoutResult,
    items,
    total,
    updateQuantity,
    removeItem,
    getWarehouse,
    warehouseResult,
    warehouseQuery,
    paymentMethodsQuery,
  } = useCart();

  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [shippingDate, setShippingDate] = useState<any>(dayjs());
  const [formData] = useState<SalesOrderFormData>({
    self_pickup: true,
  });
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isCheckingOut = checkoutResult.isLoading || isRedirecting;

  const warehouseList = (warehouseQuery?.data as any)?.data ?? [];
  const isSingleWarehouse = warehouseList.length === 1;

  // Auto-select warehouse when exactly one is available
  useEffect(() => {
    if (isSingleWarehouse) {
      setWarehouse(warehouseList[0]);
    }
  }, [warehouseQuery?.data]);

  // Auto-select saldo payment method
  useEffect(() => {
    const paymentList = (paymentMethodsQuery?.data as any)?.data ?? [];
    const saldoMethod = paymentList.find(
      (m: PaymentMethod) => m.provider === "saldo",
    );
    if (saldoMethod) {
      setPaymentMethod(saldoMethod);
    }
  }, [paymentMethodsQuery?.data]);

  const handleCheckout = async () => {
    try {
      const payload = {
        ...formData,
        warehouse_id: warehouse?.id,
        payment_method_id: paymentMethod?.id,
        shipping_date: shippingDate?.format("YYYY-MM-DD"),
      };
      const result = await doCheckout(payload);
      const orderId = result?.data?.id || result?.id;
      if (orderId) {
        setIsRedirecting(true);
        navigate(`/order/${orderId}`);
      }
    } catch (err: any) {
      // Error handled by hook
    }
  };

  return (
    <div className='min-h-screen bg-base-200 pb-52'>
      <StickyHeader showSearch={false} />

      <div className='px-4 pt-4 max-w-lg mx-auto'>
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl border border-base-200 shadow-sm'
          >
            <div className='w-20 h-20 rounded-2xl bg-base-100 flex items-center justify-center mb-6 border border-base-200'>
              <ShoppingBag size={40} className='text-base-content/20' />
            </div>
            <h3 className='text-lg font-black text-base-content tracking-tight uppercase'>
              Basket is empty
            </h3>
            <p className='text-[10px] font-bold text-base-content/40 uppercase tracking-widest mt-2 max-w-55 text-center leading-relaxed'>
              Your bread journey begins in the?
            </p>
            <button
              onClick={() => window.history.back()}
              className='mt-8 px-6 py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all'
            >
              Explore Catalog
            </button>
          </motion.div>
        ) : (
          <div className='flex flex-col gap-6'>
            {/* Cart Items Section */}
            <section>
              <SectionTitle
                title='SELECTED ITEMS'
                subtitle='Review your order'
              />
              <div className='flex flex-col gap-3'>
                <AnimatePresence mode='popLayout'>
                  {items.map((item, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      key={item?.id}
                      className='relative bg-white rounded-2xl p-3 flex items-center gap-3 premium-shadow group border border-transparent hover:border-primary/20 transition-all'
                    >
                      <div className='w-14 h-14 rounded-xl bg-base-100 overflow-hidden shrink-0 border border-base-200'>
                        <img
                          src={"https://placehold.co/400x400?text=no-image"}
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                          alt={item?.name}
                        />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <h3 className='text-sm font-black uppercase tracking-tight truncate text-base-content'>
                          {item?.name}
                        </h3>
                        <p className='text-[11px] font-black text-primary mt-0.5 italic'>
                          {currencyFormat(item?.unit_price)}
                        </p>
                      </div>

                      <div className='flex flex-col items-end gap-2'>
                        <div className='flex items-center gap-1 bg-base-100 p-1 rounded-xl border border-base-200 shadow-inner'>
                          <button
                            onClick={() =>
                              updateQuantity(item?.id, item.quantity - 1)
                            }
                            className='w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-base-content/40 hover:text-primary transition-all'
                          >
                            <Minus size={14} />
                          </button>
                          <span className='w-8 text-center text-xs font-black text-base-content'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item?.id, item.quantity + 1)
                            }
                            className='w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-base-content/40 hover:text-primary transition-all'
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item?.id)}
                          className='text-[9px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1'
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
            <section className='space-y-4'>
              <SectionTitle
                title='CHECKOUT DETAILS'
                subtitle='Fulfillment info'
              />

              <div className='grid grid-cols-1 gap-3'>
                {/* Shipping Date */}
                <div className='bg-white rounded-2xl p-4 border border-base-200 premium-shadow'>
                  <DatePicker
                    label='Tanggal Pengambilan'
                    required
                    placeholder='Pilih tanggal'
                    disablePast
                    value={shippingDate}
                    onChange={(date: any) => setShippingDate(date)}
                    error={FormState?.errors?.shipping_date as string}
                  />
                </div>

                {/* Warehouse */}
                <div className='bg-white rounded-2xl p-4 border border-base-200 premium-shadow'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center'>
                      <Wallet className='text-blue-500' size={18} />
                    </div>
                    <div>
                      <h3 className='text-[10px] font-black uppercase tracking-widest text-base-content/40'>
                        Warehouse
                      </h3>
                      <p className='text-sm font-black text-base-content uppercase tracking-tight'>
                        Pengambilan Barang
                      </p>
                    </div>
                  </div>

                  <RemoteSelect<Warehouse>
                    hook={warehouseResult as any}
                    fetchData={(page, search) => getWarehouse({ page, search })}
                    getLabel={(item: any) => item?.name}
                    value={warehouse}
                    disabled={isSingleWarehouse}
                    onChange={(item: Warehouse) => {
                      setWarehouse(item);
                    }}
                    placeholder='Pilih pengambilan barang'
                    error={FormState?.errors?.warehouse_id as string}
                  />
                  {isSingleWarehouse && (
                    <p className='text-[10px] font-bold text-base-content/40 uppercase tracking-widest mt-2'>
                      Otomatis terpilih
                    </p>
                  )}
                </div>
                {/* Payment Method */}
                <div className='bg-white rounded-2xl p-4 border border-base-200 premium-shadow'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center'>
                      <Wallet className='text-blue-500' size={18} />
                    </div>
                    <div>
                      <h3 className='text-[10px] font-black uppercase tracking-widest text-base-content/40'>
                        Payment Method
                      </h3>
                      <p className='text-sm font-black text-base-content uppercase tracking-tight'>
                        Saldo
                      </p>
                    </div>
                  </div>

                  <p className='text-sm font-black text-base-content mb-4 tracking-tight'>
                    {`Saldo Anda: ${currencyFormat(profile?.outlet?.saldo)}` ||
                      "Loading..."}
                  </p>

                  {(FormState?.errors?.payment_method_id as string) && (
                    <div className='text-error text-xs font-medium leading-[1.66] pt-1'>
                      {FormState?.errors?.payment_method_id as string}
                    </div>
                  )}

                  <button
                    onClick={() => navigate("/wallet/topup")}
                    className='w-full h-8 px-3 bg-green-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-green-600 active:scale-[0.98] transition-all flex items-center justify-center gap-1'
                  >
                    <PlusCircle size={12} />
                    Top Up
                  </button>
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
              className='fixed bottom-24 left-0 right-0 px-4 z-40'
            >
              <div className='max-w-md mx-auto bg-white rounded-2xl p-3 shadow-2xl border border-base-200 flex items-center justify-between overflow-hidden relative'>
                {/* Pattern */}
                <div className='absolute inset-0 pattern-dots opacity-10 pointer-events-none' />

                <div className='relative z-10 pl-2'>
                  <span className='text-[9px] font-black text-base-content/20 uppercase tracking-widest block mb-0.5'>
                    Grand Total
                  </span>
                  <span className='text-lg font-black text-base-content tracking-tighter italic'>
                    {currencyFormat(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className='relative z-10 h-9 px-6 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-2'
                >
                  {isCheckingOut ? (
                    <span className='loading loading-spinner loading-sm' />
                  ) : (
                    <>
                      Checkout <ArrowRight size={14} />
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
