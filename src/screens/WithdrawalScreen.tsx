/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { ArrowLeft, XCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useWithdrawalRequests,
  useWalletActions,
} from "../services/wallet/hooks";
import { currencyFormat } from "@/utils";
import { useEnigmaUI, Modal } from "@/components";
import type { WithdrawalRequest } from "@/services/types/wallet";
import { useLazyGetWithdrawalRequestDetailQuery } from "../services/wallet/api";
import dayjs from "dayjs";
import WithdrawalForm from "@/components/app/WithdrawalForm";

const statusColor = (s: string) => {
  if (s === "approved") return "text-green-500 bg-green-50";
  if (s === "rejected" || s === "cancelled") return "text-red-500 bg-red-50";
  return "text-yellow-500 bg-yellow-50";
};

const WithdrawalScreen = () => {
  const navigate = useNavigate();
  const { requests, query: withdrawalRequestsQuery } = useWithdrawalRequests();
  const {
    submitWithdrawal,
    createWithdrawalResult,
    cancelWithdrawal,
    deleteWithdrawalResult,
  } = useWalletActions();

  const [triggerDetail] = useLazyGetWithdrawalRequestDetailQuery();
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
          className='max-w-sm'
          onClose={() => closeModal("cancel-confirm")}
        >
          <Modal.Header>Batalkan Request</Modal.Header>
          <Modal.Body>
            <p className='text-xs text-base-content/60 text-center'>
              Yakin ingin membatalkan request ini?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <div className='flex gap-3 w-full'>
              <button
                className='flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-base-200 hover:bg-base-100 transition-all'
                onClick={() => closeModal("cancel-confirm")}
              >
                Tidak
              </button>
              <button
                className='flex-1 h-12 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 transition-all'
                onClick={() => {
                  cancelWithdrawal(id);
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

  const handleRequestClick = async (req: WithdrawalRequest) => {
    if (req.document_status !== "pending") return;

    try {
      const { data } = await triggerDetail(req.id).unwrap();
      const detail = data as any;

      openModal({
        id: "withdrawal-detail-modal",
        content: (
          <Modal.Wrapper
            open={true}
            className='max-w-sm'
            onClose={() => closeModal("withdrawal-detail-modal")}
          >
            <Modal.Header>Detail Penarikan</Modal.Header>
            <Modal.Body>
              <div className='p-4 bg-base-100 rounded-2xl border border-base-200 text-center mb-4'>
                <p className='text-[10px] font-bold text-base-content/40 uppercase'>
                  Nominal
                </p>
                <p className='text-lg font-black text-orange-500 italic'>
                  {currencyFormat(req.amount)}
                </p>
              </div>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='p-4 bg-base-100 rounded-2xl border border-base-200'>
                    <p className='text-[10px] font-bold text-base-content/40 uppercase'>
                      Bank
                    </p>
                    <p className='text-sm font-black text-base-content'>
                      {detail.bank_name}
                    </p>
                  </div>
                  <div className='p-4 bg-base-100 rounded-2xl border border-base-200'>
                    <p className='text-[10px] font-bold text-base-content/40 uppercase'>
                      Account Name
                    </p>
                    <p className='text-sm font-black text-base-content'>
                      {detail.bank_account_name}
                    </p>
                  </div>
                  <div className='p-4 bg-base-100 rounded-2xl border border-base-200'>
                    <p className='text-[10px] font-bold text-base-content/40 uppercase'>
                      Account Number
                    </p>
                    <p className='text-sm font-black font-mono text-primary'>
                      {detail.bank_account_number}
                    </p>
                  </div>
                  <div className='p-4 bg-base-100 rounded-2xl border border-base-200'>
                    <p className='text-[10px] font-bold text-base-content/40 uppercase'>
                      Catatan
                    </p>
                    <p className='text-sm font-black text-base-content'>
                      {detail.notes || "-"}
                    </p>
                  </div>
                </div>
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
      id: "withdrawal-modal",
      content: (
        <WithdrawalForm
          onClose={() => closeModal("withdrawal-modal")}
          onSubmit={(v) => submitWithdrawal(v)}
        />
      ),
    });
  };

  useEffect(() => {
    if (createWithdrawalResult?.isSuccess) {
      closeModal("withdrawal-modal");
    }
  }, [createWithdrawalResult]);

  useEffect(() => {
    if (deleteWithdrawalResult?.isSuccess) {
      closeModal("cancel-confirm");
    }
  }, [deleteWithdrawalResult]);

  return (
    <div className='min-h-screen bg-base-200 pb-40'>
      {/* Header */}
      <div className='sticky top-0 z-40 bg-base-200/80 backdrop-blur-md border-b border-base-300'>
        <div className='flex items-center gap-3 px-4 py-3 max-w-lg mx-auto'>
          <button
            onClick={() => navigate(-1)}
            className='w-9 h-9 rounded-xl bg-base-100 flex items-center justify-center hover:bg-base-300 transition-all active:scale-95'
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className='text-xs font-black uppercase tracking-widest'>
            Penarikan
          </h1>
        </div>
      </div>

      <div className='px-4 pt-4 max-w-lg mx-auto'>
        {/* Action Button */}
        <button
          onClick={openForm}
          className='w-full bg-orange-500 text-white rounded-2xl py-3 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all mb-6'
        >
          + Penarikan
        </button>

        {/* Request List */}
        <section>
          <h3 className='text-[9px] font-black uppercase tracking-widest text-base-content/40 mb-3'>
            Riwayat Penarikan
          </h3>
          {withdrawalRequestsQuery.isLoading ? (
            <div className='py-8 flex justify-center'>
              <span className='loading loading-spinner loading-md text-primary' />
            </div>
          ) : requests.length === 0 ? (
            <p className='text-[10px] font-bold text-base-content/30 uppercase tracking-widest text-center py-4'>
              Belum ada riwayat
            </p>
          ) : (
            <div className='space-y-2'>
              {requests.map((req: WithdrawalRequest) => (
                <div
                  key={req.id}
                  className='bg-white rounded-2xl border border-base-200 shadow-sm p-4'
                >
                  {/* Top: Code + Status badge */}
                  <div className='flex items-start justify-between gap-2 mb-2'>
                    <p className='text-xs font-black uppercase tracking-widest text-base-content truncate'>
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
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-lg font-black text-orange-500 italic'>
                      {currencyFormat(req.amount)}
                    </span>
                    <p className='text-[10px] font-bold text-base-content/50 shrink-0'>
                      {dayjs(req.created_at).format("DD MMM YYYY, HH:mm")}
                    </p>
                  </div>

                  {/* Bottom: Two side-by-side actions for pending */}
                  {req.document_status === "pending" && (
                    <div className='grid grid-cols-2 gap-2 mt-3'>
                      <button
                        onClick={() => handleRequestClick(req)}
                        className='bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 rounded-xl py-2 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all'
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                      <button
                        onClick={() => handleCancel(req.id)}
                        className='bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 rounded-xl py-2 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all'
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

export default WithdrawalScreen;
