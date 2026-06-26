import { useAuth } from "../services/auth/hooks";
import { LogOut, Shield, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEnigmaUI, Modal } from "../components";
import SectionTitle from "../components/app/SectionTitle";
import StickyHeader from "../components/app/StickyHeader";

const ProfileScreen = () => {
  const { doLogout, session } = useAuth();
  const { openModal, closeModal } = useEnigmaUI();

  const handleLogout = () => {
    openModal({
      id: "logout-confirm",
      content: (
        <Modal.Wrapper open={true} onClose={() => closeModal("logout-confirm")}>
          <Modal.Header>Sign Out</Modal.Header>
          <Modal.Body>
            <div className="py-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <LogOut size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-base-content">
                Ready to leave?
              </h3>
              <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mt-2">
                You will need to sign in again to <br /> access your franchise
                portal.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-base-200 hover:bg-base-100 transition-all"
                onClick={() => closeModal("logout-confirm")}
              >
                Stay here
              </button>
              <button
                className="flex-1 h-14 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                onClick={() => {
                  doLogout();
                  closeModal("logout-confirm");
                }}
              >
                Sign me out
              </button>
            </div>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          Loading Profile
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pb-40">
      <StickyHeader showSearch={false} />

      <div className="px-6 pt-6 max-w-lg mx-auto">
        {/* Premium Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-focus rounded-[3rem] p-8 shadow-2xl mb-10 group"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-700" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center mb-6 relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[2.5rem]" />
              <span className="text-5xl font-black text-primary italic relative z-10">
                {session?.user?.name?.charAt(0) ||
                  session?.user?.username?.charAt(0) ||
                  "U"}
              </span>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-2xl shadow-lg flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-3">
              {session?.user?.name || "Premium Member"}
            </h2>
          </div>

          <svg
            viewBox="0 0 1440 390"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 left-0 w-full h-[80px] pointer-events-none"
            style={{ opacity: 0.15 }}
            preserveAspectRatio="none"
          >
            <path
              d="M 0,400 L 0,150 C 36.02,139.67 72.04,129.34 130,138 C 187.96,167.32 267.86,246.64 335,285 C 402.14,323.36 456.52,320.78 522,298 C 587.48,275.22 664.05,232.23 728,232 C 791.95,231.77 843.28,274.29 906,310 C 968.72,345.71 1042.84,374.61 1104,370 C 1165.16,365.39 1213.36,327.27 1276,298 C 1338.64,268.73 1415.72,248.31 1440,238 L 1440,400 Z"
              fill="#ffffff"
            />
          </svg>
        </motion.div>

        <div className="space-y-10">
          {/* Info Sections */}
          <div className="grid grid-cols-1 gap-8">
            {/* Account Details */}
            <section>
              <SectionTitle
                title="ACCOUNT INFO"
                subtitle="Security & Profile"
              />
              <div className="bg-white rounded-[2.5rem] p-6 border border-base-200 shadow-sm space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                    <UserCircle2 size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/30">
                      Username
                    </span>
                    <span className="text-sm font-black text-base-content">
                      @{session?.user?.username}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* <section>
              <SectionTitle title="OUTLET INFO" subtitle="Store Location" />
              <div className="bg-white rounded-[2.5rem] p-6 border border-base-200 shadow-sm space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                    <Store size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/30">
                      Outlet Name
                    </span>
                    <span className="text-sm font-black text-base-content">
                      {outlet?.name || "Unnamed Outlet"}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-base-100" />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                    <MapPin size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/30">
                      Address
                    </span>
                    <span className="text-sm font-black text-base-content">
                      {outlet?.address || "No address provided"}
                    </span>
                    <span className="text-[10px] font-bold text-base-content/40 uppercase mt-0.5">
                      {outlet?.city || "Unknown City"}
                    </span>
                  </div>
                </div>
              </div>
            </section> */}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full h-16 bg-red-50 text-red-500 rounded-[2rem] border border-red-100 font-black text-sm uppercase tracking-[0.2em] shadow-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <LogOut size={20} />
            Sign Out
          </button>

          {/* <div className="text-center pb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-base-content/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
              <div className="h-px w-8 bg-base-content/10" />
            </div>
            <p className="text-[9px] font-black tracking-[0.4em] text-base-content/20 uppercase">
              SukaBread Mobile <br />{" "}
              <span className="text-primary/40 italic">
                Premium Edition v2.1.0
              </span>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
