/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useAppSelector } from "@/hooks";
import type { PaymentMethod } from "@/services/types/payment";
import { useCart } from "@/services/cart/hooks";
import { Input, Modal, RemoteSelect } from "../ui";

type FormState = {
  amount: string;
  note: string;
};
const initialForm: FormState = {
  amount: "",
  note: "",
};

const TopupForm = ({
  onClose,
  onSubmit,
}: {
  onClose?: () => void;
  onSubmit?: (v: any) => void;
}) => {
  const FormState = useAppSelector((s) => s.form);

  const [form, setForm] = useState<FormState>(initialForm);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );

  const { getPayment, paymentResult } = useCart();

  const handleSubmit = () => {
    const payload = {
      amount: Number(form?.amount),
      note: form?.note,
      payment_method_id: paymentMethod?.id,
    };
    onSubmit?.(payload);
  };

  return (
    <Modal.Wrapper open={true} onClose={() => onClose?.()} className="max-w-sm">
      <Modal.Header>Top Up Saldo</Modal.Header>
      <Modal.Body>
        <div className="space-y-4 pt-2">
          <Input
            label="Nominal"
            type="currency"
            placeholder="Rp 0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            error={FormState?.errors?.amount as string}
          />

          <RemoteSelect<PaymentMethod>
            required
            label="Metode Pembayaran"
            hook={paymentResult as any}
            fetchData={(page, search) => getPayment({ page, search })}
            getLabel={(item: any) => `${item?.name}`}
            renderItem={(item: any) => (
              <div className="flex flex-col">
                <span>{item?.name}</span>
                <span className="text-xs text-gray-500 ">{item?.provider}</span>
              </div>
            )}
            value={paymentMethod}
            onChange={(item: PaymentMethod) => {
              setPaymentMethod(item);
            }}
            placeholder="Pilih method"
            error={FormState?.errors?.payment_method_id as string}
          />

          <Input
            label="Keterangan"
            type="textarea"
            placeholder="Masukkan keterangan..."
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-3 w-full">
          <button
            className="flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-base-200 hover:bg-base-100 transition-all"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="flex-1 h-12 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg bg-green-500 hover:bg-green-600 shadow-green-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            onClick={handleSubmit}
          >
            Submit Top Up
          </button>
        </div>
      </Modal.Footer>
    </Modal.Wrapper>
  );
};

export default TopupForm;
