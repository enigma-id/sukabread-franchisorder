/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { ArrowLeft, XCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTopupRequests, useWalletActions } from "../services/wallet/hooks";
import { currencyFormat } from "@/utils";
import { useEnigmaUI, Modal } from "@/components";
import type { TopupRequest } from "@/services/types/wallet";
import { useLazyGetTopupRequestDetailQuery } from "../services/wallet/api";
import dayjs from "dayjs";
import TopupForm from "@/components/app/TopupForm";

const statusColor = (s: string) => {
  if (s === "approved") return "text-green-500 bg-green-50";
  if (s === "rejected") return "text-red-500 bg-red-50";
  return "text-yellow-500 bg-yellow-50";
};

const TopupScreen = () => {
  const navigate = useNavigate();
  const { requests, query: topupRequestsQuery } = useTopupRequests();
  const { submitTopup, createTopupResult, cancelTopup, deleteTopupResult } =
    useWalletActions();

  const [triggerDetail] = useLazyGetTopupRequestDetailQuery();
  const { openModal, closeModal } = useEnigmaUI();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCancel = (id: string) => {
    openModal({
      id: "cancel-confirm",
      content: (
        <Modal.Wrapper
          open={true}
          className="max-w-sm"
          onClose={() => closeModal("cancel-confirm")}
        >
          <Modal.Header>Batalkan Request</Modal.Header>
          <Modal.Body>
            <p className="text-xs text-base-content/60 text-center">
              Yakin ingin membatalkan request ini?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-base-200 hover:bg-base-100 transition-all"
                onClick={() => closeModal("cancel-confirm")}
              >
                Tidak
              </button>
              <button
                className="flex-1 h-12 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 transition-all"
                onClick={() => {
                  cancelTopup(id);
                }}
              >
                Ya, Batalkan
              </button>
            </div>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleRequestClick = async (req: TopupRequest) => {
    if (req.document_status !== "pending") return;

    try {
      const { data } = await triggerDetail(req.id).unwrap();
      const detail = data as any; // Temporary cast to allow access to fields

      openModal({
        id: "payment-detail-modal",
        content: (
          <Modal.Wrapper
            open={true}
            className="max-w-sm"
            onClose={() => closeModal("payment-detail-modal")}
          >
            <Modal.Header>Detail Pembayaran</Modal.Header>
            <Modal.Body>
              <div className="p-4 bg-base-100 rounded-2xl border border-base-200 text-center mb-4">
                <p className="text-[10px] font-bold text-base-content/40 uppercase">
                  Nominal
                </p>
                <p className="text-lg font-black text-green-500 italic">
                  {currencyFormat(req.amount)}
                </p>
              </div>
              <div className="space-y-4">
                {detail.payment_method?.provider === "qris" && (
                  <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-base-200">
                    <img
                      src={detail.payment.qr_url}
                      alt="QR Code"
                      className="w-64 h-64 object-contain mb-4"
                    />
                    <p className="text-xs font-black text-base-content text-center uppercase mb-4">
                      Scan QRIS untuk Pembayaran
                    </p>
                    <p className="text-[10px] text-base-content/50 text-center mb-4">
                      Atau screenshot QRIS untuk membayar di aplikasi
                      bank/e-wallet Anda.
                    </p>
                  </div>
                )}
                {detail.payment_method?.provider === "midtrans" && (
                  <div className="space-y-3">
                    <div className="p-4 bg-base-100 rounded-2xl border border-base-200">
                      <p className="text-[10px] font-bold text-base-content/40 uppercase">
                        Bank
                      </p>
                      <p className="text-sm font-black text-base-content">
                        {detail.payment?.bank_name}
                      </p>
                    </div>
                    <div className="p-4 bg-base-100 rounded-2xl border border-base-200">
                      <p className="text-[10px] font-bold text-base-content/40 uppercase">
                        Virtual Account Number
                      </p>
                      <p className="text-sm font-black font-mono text-primary">
                        {detail.va_number}
                      </p>
                    </div>
                  </div>
                )}
                {detail.payment_method?.provider === "manual" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-base-100 rounded-2xl border border-base-200">
                      <p className="text-[10px] font-bold text-base-content/40 uppercase">
                        Bank
                      </p>
                      <p className="text-sm font-black text-base-content">
                        {detail.payment_method?.name}
                      </p>
                    </div>
                    <div className="p-4 bg-base-100 rounded-2xl border border-base-200">
                      <p className="text-[10px] font-bold text-base-content/40 uppercase">
                        Account Name
                      </p>
                      <p className="text-sm font-black text-base-content">
                        {detail.payment_method?.account_name}
                      </p>
                    </div>
                    <div className="p-4 bg-base-100 rounded-2xl border border-base-200">
                      <p className="text-[10px] font-bold text-base-content/40 uppercase">
                        Account Number
                      </p>
                      <p className="text-sm font-black font-mono text-primary">
                        {detail.payment_method?.account_number}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Modal.Body>
          </Modal.Wrapper>
        ),
      });
    } catch (err) {
      console.error("Failed to fetch detail", err);
    }
  };

  const openForm = () => {
    openModal({
      id: "topup-modal",
      content: (
        <TopupForm
          onClose={() => closeModal("topup-modal")}
          onSubmit={(v) => submitTopup(v)}
        />
      ),
    });
  };

  useEffect(() => {
    if (createTopupResult?.isSuccess) {
      closeModal("topup-modal");
    }
  }, [createTopupResult]);

  useEffect(() => {
    if (deleteTopupResult?.isSuccess) {
      closeModal("cancel-confirm");
    }
  }, [deleteTopupResult]);

  return (
    <div className="min-h-screen bg-base-200 pb-40">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-base-200/80 backdrop-blur-md border-b border-base-300">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-base-100 flex items-center justify-center hover:bg-base-300 transition-all active:scale-95"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xs font-black uppercase tracking-widest">
            Top Up
          </h1>
        </div>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto">
        {/* Action Button */}
        <button
          onClick={openForm}
          className="w-full bg-green-500 text-white rounded-2xl py-3 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-green-600 active:scale-[0.98] transition-all mb-6"
        >
          + Ajukan Top Up
        </button>

        {/* Request List */}
        <section>
          <h3 className="text-[9px] font-black uppercase tracking-widest text-base-content/40 mb-3">
            Riwayat Top Up
          </h3>
          {topupRequestsQuery.isLoading ? (
            <div className="py-8 flex justify-center">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest text-center py-4">
              Belum ada riwayat
            </p>
          ) : (
            <div className="space-y-2">
              {requests.map((req: TopupRequest) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-base-200 shadow-sm p-4"
                >
                  {/* Top: Code + Status badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-xs font-black uppercase tracking-widest text-base-content truncate">
                      {req.code}
                    </p>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg shrink-0 ${statusColor(
                        req.document_status,
                      )}`}
                    >
                      {req.document_status}
                    </span>
                  </div>

                  {/* Middle: Amount + Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-green-500 italic">
                        {currencyFormat(req.amount)}
                      </span>
                      <div className="text-[10px] font-bold text-base-content/60 bg-base-200 px-2 py-1 rounded-lg">
                        {req.payment_method?.name || "-"}
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-base-content/50 shrink-0">
                      {dayjs(req.created_at).format("DD MMM YYYY, HH:mm")}
                    </p>
                  </div>

                  {/* Bottom: Two side-by-side actions for pending */}
                  {req.document_status === "pending" && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleRequestClick(req)}
                        className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 rounded-xl py-2 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                      <button
                        onClick={() => handleCancel(req.id)}
                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 rounded-xl py-2 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                      >
                        <XCircle size={14} />
                        Batalkan
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TopupScreen;
