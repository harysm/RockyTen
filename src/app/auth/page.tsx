"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, UserPlus, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const { loginProfile, addProfile, isLoggedIn, departments } = useApp();
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "register">("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPw, setLoginShowPw] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regDept, setRegDept] = useState("");
  const [regShowPw, setRegShowPw] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.push("/");
  }, [isLoggedIn, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = loginProfile(loginEmail, loginPassword);
    setLoginLoading(false);
    if (!result.success) setLoginError(result.error || "Login gagal.");
    else router.push("/");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (regPassword.length < 6) { setRegError("Password minimal 6 karakter."); return; }
    if (regPassword !== regConfirm) { setRegError("Konfirmasi password tidak cocok."); return; }
    if (!regDept) { setRegError("Pilih divisi Anda."); return; }
    setRegLoading(true);
    const result = await addProfile({ name: regName, role: "pic", departmentId: regDept }, regEmail, regPassword);
    setRegLoading(false);
    if (!result.success) setRegError(result.error || "Pendaftaran gagal.");
    else router.push("/");
  };

  const ic = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all";
  const lc = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";


  return (
    <div className="w-full max-w-md mx-auto">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img 
              src="/gerilya-logo-merah-transparent.svg" 
              className="w-10 h-10 object-contain flex-shrink-0" 
              alt="Nasi Gerilya Logo" 
            />
            <div>
              <p className="text-slate-900 font-extrabold text-sm tracking-wider uppercase">Scoreboard</p>
              <p className="text-slate-400 text-[9px] font-bold tracking-widest uppercase">Nasi Gerilya</p>
            </div>
          </div>

          {/* Card wrapper */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">

          {/* Header text */}
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {tab === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1.5">
              {tab === "login"
                ? "Masuk untuk mengakses dashboard scoreboard Anda."
                : "Daftarkan diri sebagai PIC divisi baru."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-7 border border-slate-200">
            <button
              onClick={() => { setTab("login"); setLoginError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                tab === "login"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Masuk
            </button>
            <button
              onClick={() => { setTab("register"); setRegError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                tab === "register"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Daftar
            </button>
          </div>

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <label className={lc}>Alamat Email</label>
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  placeholder="email@nasigerilya.com" className={ic} autoComplete="email" />
              </div>

              <div>
                <label className={lc}>Password</label>
                <div className="relative">
                  <input type={loginShowPw ? "text" : "password"} required value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••"
                    className={`${ic} pr-12`} autoComplete="current-password" />
                  <button type="button" onClick={() => setLoginShowPw(!loginShowPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {loginShowPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600">
                  <span className="mt-0.5">⚠</span> {loginError}
                </div>
              )}

              <button type="submit" disabled={loginLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-500 active:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-60 disabled:cursor-not-allowed">
                {loginLoading
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><span>Masuk ke Dashboard</span> <ArrowRight className="w-4 h-4" /></>}
              </button>

            </form>
          )}

          {/* REGISTER FORM */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-200">
              <div>
                <label className={lc}>Nama Lengkap</label>
                <input type="text" required value={regName} onChange={e => setRegName(e.target.value)}
                  placeholder="Nama lengkap Anda..." className={ic} />
              </div>

              <div>
                <label className={lc}>Alamat Email</label>
                <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)}
                  placeholder="email@nasigerilya.com" className={ic} autoComplete="email" />
              </div>

              <div>
                <label className={lc}>Divisi</label>
                <select required value={regDept} onChange={e => setRegDept(e.target.value)}
                  className={`${ic} cursor-pointer`}>
                  <option value="">Pilih divisi Anda...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lc}>Password</label>
                  <div className="relative">
                    <input type={regShowPw ? "text" : "password"} required value={regPassword}
                      onChange={e => setRegPassword(e.target.value)} placeholder="min. 6 karakter"
                      className={`${ic} pr-10`} autoComplete="new-password" />
                    <button type="button" onClick={() => setRegShowPw(!regShowPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {regShowPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={lc}>Konfirmasi</label>
                  <input type="password" required value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                    placeholder="••••••••" className={ic} autoComplete="new-password" />
                </div>
              </div>

              {regError && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600">
                  <span className="mt-0.5">⚠</span> {regError}
                </div>
              )}

              <button type="submit" disabled={regLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-500 active:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-60 disabled:cursor-not-allowed">
                {regLoading
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><span>Daftar & Masuk</span> <ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="text-[10px] text-slate-400 text-center font-medium">
                Akun Owner hanya bisa dibuat oleh Owner lewat menu Pengaturan → Kelola User.
              </p>
            </form>
          )}

          </div>
      </div>
  );
}