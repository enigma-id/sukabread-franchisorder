/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAppSelector } from "@/hooks";
import { Input, Modal } from "../ui";

type FormState = {
  amount: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  notes: string;
};
const initialForm: FormState = {
  amount: "",
  bank_name: "",
  bank_account_name: "",
  bank_account_number: "",
  notes: "",
};

const WithdrawalForm = ({
  onClose,
  onSubmit,
}: {
  onClose?: () => void;
  onSubmit?: (v: any) => void;
}) => {
  const FormState = useAppSelector((s) => s.form);

  const [form, setForm] = useState<FormState>(initialForm);

  const handleSubmit = () => {
    const payload = {
      amount: Number(form?.amount),
      bank_name: form?.bank_name,
      bank_account_name: form?.bank_account_name,
      bank_account_number: form?.bank_account_number,
      notes: form?.notes,
    };
    onSubmit?.(payload);
  };

  return (
    <Modal.Wrapper open={true} onClose={() => onClose?.()} className="max-w-sm">
      <Modal.Header>Penarikan Saldo</Modal.Header>
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

          <Input
            label="Nama Bank"
            placeholder="Nama Bank"
            value={form.bank_name}
            onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
            required
            error={FormState?.errors?.bank_name as string}
          />

          <Input
            label="Nama Pemilik Rekening"
            placeholder="Nama Pemilik Rekening"
            value={form.bank_account_name}
            onChange={(e) => setForm({ ...form, bank_account_name: e.target.value })}
            required
            error={FormState?.errors?.bank_account_name as string}
          />

          <Input
            label="Nomor Rekening"
            placeholder="Nomor Rekening"
            value={form.bank_account_number}
            onChange={(e) => setForm({ ...form, bank_account_number: e.target.value })}
            required
            error={FormState?.errors?.bank_account_number as string}
          />

          <Input
            label="Keterangan"
            type="textarea"
            placeholder="Masukkan keterangan..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
            className="flex-1 h-12 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            onClick={handleSubmit}
          >
            Submit Penarikan
          </button>
        </div>
      </Modal.Footer>
    </Modal.Wrapper>
  );
};

export default WithdrawalForm;
