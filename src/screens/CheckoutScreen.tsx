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
    getPayment,
    paymentResult,
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

      <div className='px-6 pt-6 max-w-lg mx-auto'>
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='flex flex-col items-center justify-center py-20 px-8 bg-white rounded-[3rem] border border-base-200 shadow-sm'
          >
            <div className='w-24 h-24 rounded-[2.5rem] bg-base-100 flex items-center justify-center mb-8 border border-base-200'>
              <ShoppingBag size={48} className='text-base-content/20' />
            </div>
            <h3 className='text-xl font-black text-base-content tracking-tight uppercase'>
              Basket is empty
            </h3>
            <p className='text-xs font-bold text-base-content/40 uppercase tracking-widest mt-3 max-w-55 text-center leading-relaxed'>
              Your bread journey begins in the?
            </p>
            <button
              onClick={() => window.history.back()}
              className='mt-10 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all'
            >
              Explore Catalog
            </button>
          </motion.div>
        ) : (
          <div className='flex flex-col gap-10'>
            {/* Cart Items Section */}
            <section>
              <SectionTitle
                title='SELECTED ITEMS'
                subtitle='Review your order'
              />
              <div className='flex flex-col gap-4'>
                <AnimatePresence mode='popLayout'>
                  {items.map((item, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      key={item?.id}
                      className='relative bg-white rounded-3xl p-4 flex items-center gap-4 premium-shadow group border border-transparent hover:border-primary/20 transition-all'
                    >
                      <div className='w-16 h-16 rounded-2xl bg-base-100 overflow-hidden shrink-0 border border-base-200'>
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
            <section className='space-y-6'>
              <SectionTitle
                title='CHECKOUT DETAILS'
                subtitle='Fulfillment info'
              />

              <div className='grid grid-cols-1 gap-4'>
                {/* Shipping Date */}
                <div className='bg-white rounded-3xl p-6 border border-base-200 premium-shadow'>
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
                <div className='bg-white rounded-3xl p-6 border border-base-200 premium-shadow'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center'>
                      <Wallet className='text-blue-500' size={20} />
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
                <div className='bg-white rounded-3xl p-6 border border-base-200 premium-shadow'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center'>
                      <Wallet className='text-blue-500' size={20} />
                    </div>
                    <div>
                      <h3 className='text-[10px] font-black uppercase tracking-widest text-base-content/40'>
                        Payment Method
                      </h3>
                      <p className='text-sm font-black text-base-content uppercase tracking-tight'>
                        Pilih Payment Method
                      </p>
                    </div>
                  </div>

                  <RemoteSelect<PaymentMethod>
                    hook={paymentResult as any}
                    fetchData={(page, search) => getPayment({ page, search })}
                    getLabel={(item: any) => `${item?.name}`}
                    renderItem={(item: any) => (
                      <div className='flex flex-col'>
                        <span>{item?.name}</span>
                        <span className='text-xs text-gray-500 '>
                          {item?.provider}
                        </span>
                      </div>
                    )}
                    value={paymentMethod}
                    onChange={(item: PaymentMethod) => {
                      setPaymentMethod(item);
                    }}
                    placeholder='Pilih method'
                    error={FormState?.errors?.payment_method_id as string}
                  />

                  {paymentMethod?.provider === "saldo" && (
                    <p className='text-[10px] font-bold text-base-content/40 uppercase tracking-widest mt-2'>
                      Saldo Anda: {currencyFormat(profile?.outlet?.saldo)}
                    </p>
                  )}
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
              className='fixed bottom-24 left-0 right-0 px-6 z-40'
            >
              <div className='max-w-md mx-auto bg-white rounded-[2.5rem] p-4 pr-4 shadow-2xl border border-base-200 flex items-center justify-between overflow-hidden relative'>
                {/* Pattern */}
                <div className='absolute inset-0 pattern-dots opacity-10 pointer-events-none' />

                <div className='relative z-10 pl-4'>
                  <span className='text-[10px] font-black text-base-content/20 uppercase tracking-widest block mb-1'>
                    Grand Total
                  </span>
                  <span className='text-xl font-black text-base-content tracking-tighter italic'>
                    {currencyFormat(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className='relative z-10 h-10 px-8 bg-primary text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-3'
                >
                  {isCheckingOut ? (
                    <span className='loading loading-spinner loading-sm' />
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
