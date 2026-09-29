"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  ArrowRight, 
  ChevronDown, 
  Check, 
  UtensilsCrossed, 
  Users, 
  Laptop, 
  Coins, 
  Megaphone, 
  Building2 
} from "lucide-react";

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

  // Custom Divisi Dropdown state & ref
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const deptDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoggedIn) router.push("/");
  }, [isLoggedIn, router]);

  // Click outside & Escape listener for Divisi Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setDeptDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDeptDropdownOpen(false);
      }
    };
    if (deptDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [deptDropdownOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = await loginProfile(loginEmail, loginPassword);
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

  const ic = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 transition-all";
  const lc = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  // Helper for department icon
  const getDeptIcon = (id: string, isSelected: boolean = false) => {
    if (id.includes("it")) return <Laptop className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-blue-500"}`} />;
    if (id.includes("kitchen")) return <UtensilsCrossed className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-amber-500"}`} />;
    if (id.includes("service")) return <Users className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-emerald-500"}`} />;
    if (id.includes("finance")) return <Coins className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-indigo-500"}`} />;
    if (id.includes("marketing")) return <Megaphone className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-rose-500"}`} />;
    return <Building2 className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />;
  };

  const selectedDept = departments.find(d => d.id === regDept);

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

        {/* Tab switcher with smooth sliding black pill */}
        <div className="relative flex p-1 bg-slate-100/90 rounded-2xl mb-7 border border-slate-200">
          {/* Hardware-accelerated sliding black pill */}
          <div
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl bg-zinc-950 shadow-md transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: tab === "login" ? "translateX(0%)" : "translateX(100%)",
            }}
          />
          <button
            type="button"
            onClick={() => { setTab("login"); setLoginError(""); }}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 select-none cursor-pointer ${
              tab === "login"
                ? "text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Masuk
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setRegError(""); }}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 select-none cursor-pointer ${
              tab === "register"
                ? "text-white"
                : "text-slate-500 hover:text-slate-900"
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
              <input 
                type="email" 
                required 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="contoh: it@ng.com" 
                className={ic} 
                autoComplete="email" 
              />
            </div>

            <div>
              <label className={lc}>Password</label>
              <div className="relative">
                <input 
                  type={loginShowPw ? "text" : "password"} 
                  required 
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)} 
                  placeholder="••••••••"
                  className={`${ic} pr-12`} 
                  autoComplete="current-password" 
                />
                <button 
                  type="button" 
                  onClick={() => setLoginShowPw(!loginShowPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {loginShowPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-start gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600">
                <span className="mt-0.5">⚠</span> {loginError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-950 hover:bg-zinc-800 active:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-zinc-950/20 hover:shadow-zinc-950/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loginLoading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span> 
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-200">
            <div>
              <label className={lc}>Nama Lengkap</label>
              <input 
                type="text" 
                required 
                value={regName} 
                onChange={e => setRegName(e.target.value)}
                placeholder="Nama lengkap Anda..." 
                className={ic} 
              />
            </div>

            <div>
              <label className={lc}>Alamat Email</label>
              <input 
                type="email" 
                required 
                value={regEmail} 
                onChange={e => setRegEmail(e.target.value)}
                placeholder="contoh: user@ng.com" 
                className={ic} 
                autoComplete="email" 
              />
            </div>

            {/* Divisi Custom Dropdown */}
            <div className="relative" ref={deptDropdownRef}>
              <label className={lc}>Divisi</label>
              <button
                type="button"
                onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                className={`${ic} cursor-pointer flex items-center justify-between text-left ${
                  deptDropdownOpen ? "border-zinc-400 ring-2 ring-zinc-900/10 bg-white" : ""
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2 min-w-0">
                  {selectedDept ? (
                    <>
                      <span className="shrink-0">{getDeptIcon(selectedDept.id)}</span>
                      <span className="truncate font-bold text-slate-900">{selectedDept.name}</span>
                    </>
                  ) : (
                    <span className="text-slate-400 font-normal">Pilih divisi Anda...</span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    deptDropdownOpen ? "rotate-180 text-zinc-900" : ""
                  }`}
                />
              </button>

              {/* Dropdown Options Popup */}
              {deptDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in-0 slide-in-from-top-1 duration-150"
                >
                  <div className="space-y-0.5">
                    {departments.map((d) => {
                      const isSelected = regDept === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setRegDept(d.id);
                            setDeptDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-100 flex items-center justify-between cursor-pointer select-none text-left ${
                            isSelected
                              ? "bg-zinc-950 text-white font-bold shadow-2xs"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate min-w-0 pr-2">
                            <span className="shrink-0">
                              {getDeptIcon(d.id, isSelected)}
                            </span>
                            <span className="truncate">{d.name}</span>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 shrink-0 stroke-[3] text-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lc}>Password</label>
                <div className="relative">
                  <input 
                    type={regShowPw ? "text" : "password"} 
                    required 
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)} 
                    placeholder="min. 6 karakter"
                    className={`${ic} pr-10`} 
                    autoComplete="new-password" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setRegShowPw(!regShowPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {regShowPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={lc}>Konfirmasi</label>
                <input 
                  type="password" 
                  required 
                  value={regConfirm} 
                  onChange={e => setRegConfirm(e.target.value)}
                  placeholder="••••••••" 
                  className={ic} 
                  autoComplete="new-password" 
                />
              </div>
            </div>

            {regError && (
              <div className="flex items-start gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600">
                <span className="mt-0.5">⚠</span> {regError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={regLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-950 hover:bg-zinc-800 active:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-zinc-950/20 hover:shadow-zinc-950/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {regLoading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Daftar & Masuk</span> 
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
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