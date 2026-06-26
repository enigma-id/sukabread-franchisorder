import React, { useState } from "react";
import { useAuth } from "../services/auth/hooks";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { Button, Input } from "@/components";

const LoginScreen = () => {
  const FormState = useAppSelector((s) => s.form);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { doSignin, signinResult } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      identifier: username,
      password,
    };

    doSignin(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -ml-32 -mb-32" />
      <div className="absolute inset-0 pattern-dots opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2.5rem] shadow-2xl mb-6 border border-base-200"
          >
            <span className="text-3xl font-black text-primary italic">S</span>
          </motion.div>
          <h1 className="text-4xl font-black text-base-content tracking-tighter uppercase leading-none">
            SUKA<span className="text-primary italic">BREAD</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-base-content/50 mt-2">
            Franchise Partner Portal
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 border border-white shadow-2xl premium-shadow">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              variant="primary"
              type="text"
              name="username"
              className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              prefix={
                <User size={18} className="text-[#a0aabf]" strokeWidth={2} />
              }
              error={
                typeof FormState?.errors?.identifier === "string"
                  ? FormState.errors.identifier
                  : undefined
              }
            />

            {/* Password Input */}

            <Input
              variant="primary"
              name="password"
              className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
              placeholder="........"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              prefix={
                <Lock size={18} className="text-[#a0aabf]" strokeWidth={2} />
              }
              error={
                typeof FormState?.errors?.password === "string"
                  ? FormState.errors.password
                  : undefined
              }
            />

            <div className="pt-4">
              <Button
                type="submit"
                isLoading={signinResult?.isLoading}
                variant="primary"
                shape="wide"
                size="lg"
                className="rounded-full"
              >
                Login
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center mt-10 text-[9px] font-black uppercase tracking-[0.4em] text-base-content/40">
          Powered by Enigma <br />
          {/* <span className="text-primary/60 italic">
            Premium Enterprise v2.0
          </span> */}
        </p>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
