import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../services/profile/hooks";
import { useBalanceLogs } from "../services/wallet/hooks";
import { currencyFormat } from "@/utils";
import StickyHeader from "@/components/app/StickyHeader";
import type { BalanceLog } from "@/services/types/wallet";
import dayjs from "dayjs";

const WalletScreen = () => {
  const navigate = useNavigate();
  const { query: { data: profile } = { data: undefined } } = useProfile();
  const { balanceLogs, query: balanceLogsQuery } = useBalanceLogs();

  const outlet = profile?.outlet;

  const renderLogItem = (log: BalanceLog) => {
    const isTopup = log.nominal > 0;
    return (
      <div
        key={log.id}
        className="flex items-center gap-3 py-3 border-b border-base-100 last:border-b-0"
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isTopup
              ? "bg-green-50 text-green-500"
              : "bg-orange-50 text-orange-500"
          }`}
        >
          {isTopup ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-base-content capitalize truncate">
            {log.reference_type?.replace(/_/g, " ")}
          </p>
          <p className="text-[9px] font-bold text-base-content/40 uppercase tracking-widest mt-0.5">
            {dayjs(log.created_at).format("DD MMM YYYY, HH:mm")}
          </p>
        </div>
        <span
          className={`text-xs font-black italic ${
            isTopup ? "text-green-500" : "text-orange-500"
          }`}
        >
          {isTopup ? "+" : ""}
          {currencyFormat(Math.abs(log.nominal))}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200 pb-40">
      <StickyHeader showSearch={false} />

      <div className="px-4 pt-4 max-w-lg mx-auto">
        {/* Saldo Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-linear-to-br from-primary via-primary to-primary-focus rounded-2xl p-4 shadow-xl mb-4 group"
        >
          <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-700" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1 border border-white/20">
              <Wallet size={18} className="text-white" />
            </div>

            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/80 mb-0.5">
              Saldo Tersedia
            </h2>
            <span className="text-2xl font-black text-white tracking-tight italic leading-none">
              {currencyFormat(outlet?.saldo)}
            </span>
          </div>

          {/* Action Buttons as Card Footer */}
          <div className="relative z-10 pt-4 mt-4 border-t border-white/20 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/wallet/topup")}
              className="bg-white hover:bg-white/90 text-primary rounded-xl py-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ArrowDownRight size={14} />
              Top Up
            </button>
            <button
              onClick={() => navigate("/wallet/withdrawal")}
              className="bg-white hover:bg-white/90 text-primary rounded-xl py-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ArrowUpRight size={14} />
              Penarikan
            </button>
          </div>

          <svg
            viewBox="0 0 1440 390"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 left-0 w-full h-16 pointer-events-none"
            style={{ opacity: 0.15 }}
            preserveAspectRatio="none"
          >
            <path
              d="M 0,400 L 0,150 C 36.02,139.67 72.04,129.34 130,138 C 187.96,167.32 267.86,246.64 335,285 C 402.14,323.36 456.52,320.78 522,298 C 587.48,275.22 664.05,232.23 728,232 C 791.95,231.77 843.28,274.29 906,310 C 968.72,345.71 1042.84,374.61 1104,370 C 1165.16,365.39 1213.36,327.27 1276,298 C 1338.64,268.73 1415.72,248.31 1440,238 L 1440,400 Z"
              fill="#ffffff"
            />
          </svg>
        </motion.div>

        {/* Saldo Log */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-base-100 flex items-center justify-center">
              <Clock size={14} className="text-base-content/40" />
            </div>
            <div>
              <h3 className="text-[9px] font-black uppercase tracking-widest text-base-content/40">
                Saldo Log
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-base-200 shadow-sm">
            {balanceLogsQuery.isLoading ? (
              <div className="py-10 flex justify-center">
                <span className="loading loading-spinner loading-md text-primary" />
              </div>
            ) : balanceLogs.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest">
                  Belum ada transaksi
                </p>
              </div>
            ) : (
              <div>{balanceLogs.map(renderLogItem)}</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WalletScreen;
