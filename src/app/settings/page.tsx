"use client";

import React, { useState, useRef } from "react";
import { useApp, Profile, Department } from "@/context/AppContext";
import { supabase, ENABLE_DATABASE } from "@/lib/supabase";
import { Settings, User, Bell, Users, Layers, ShieldAlert, KeyRound, Plus, Trash2, Send, Camera, Mail, Building, Edit3, X, Check, RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const {
    currentProfile,
    allProfiles,
    credentials,
    updateProfileAndSave,
    addProfile,
    departments,
    language,
    updateLanguage,
    theme,
    updateTheme,
    fontSize,
    updateFontSize,
    uiDensity,
    updateUiDensity,
    highContrast,
    updateHighContrast,
    reduceMotion,
    updateReduceMotion,
    emailNotifSettings,
    updateEmailNotifSettings,
    sendEmailNotification,
    showToast,
    showConfirm,
    resetToDummyData
  } = useApp();

  const [isSendingTest, setIsSendingTest] = useState(false);
  const [manualNote, setManualNote] = useState("");
  const [isSendingManualDigest, setIsSendingManualDigest] = useState(false);

  const [activeTab, setActiveTab] = useState<string>("profile");

  // Profile Tab state
  const currentEmailKey = Object.keys(credentials).find(key => credentials[key].profileId === currentProfile.id) || `${currentProfile.name.toLowerCase()}@nasigerilya.com`;
  const [profileName, setProfileName] = useState(currentProfile.name);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(currentProfile.avatarUrl || "");
  const [profileEmail, setProfileEmail] = useState(currentEmailKey);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setProfileAvatarUrl(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Manage Users Tab state (Owner only)
  const [usersList, setUsersList] = useState<Profile[]>(allProfiles);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<Profile["role"]>("pic");
  const [newUserDept, setNewUserDept] = useState("");
  const [newUserAvatar, setNewUserAvatar] = useState("");

  // Manage Divisions Tab state (Owner only)
  const [deptsList, setDeptsList] = useState<Department[]>(departments);
  const [newDeptName, setNewDeptName] = useState("");



  const isOwner = currentProfile.role === "owner";
  const isDeveloper = currentProfile.role === "developer";
  const isOwnerOrDev = isOwner || isDeveloper;

  const getDeptName = (id: string | null, userRole?: string) => {
    if (userRole === "developer") return "Developer";
    if (userRole === "owner" || !id) return "Owner / Management";
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : "PIC";
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert(language === "id" ? "Password konfirmasi tidak cocok!" : "Confirm password does not match!");
      return;
    }
    
    setIsSaving(true);
    // Update active profile, email & password
    const updatedProfile: Profile = {
      ...currentProfile,
      name: profileName,
      avatarUrl: profileAvatarUrl || undefined
    };

    updateProfileAndSave(updatedProfile, profileEmail, newPassword);
    
    alert(language === "id" ? "Profil dan password berhasil disimpan!" : "Profile and password successfully saved!");
    
    // Reset password & edit states
    setNewPassword("");
    setConfirmPassword("");
    setIsEditingProfile(false);
    setIsSaving(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) {
      alert("Mohon isi Nama, Email, dan Password untuk user baru.");
      return;
    }

    const res = await addProfile({
      name: newUserName,
      role: newUserRole,
      departmentId: newUserRole === "owner" ? null : newUserDept,
      avatarUrl: newUserAvatar || undefined
    }, newUserEmail, newUserPassword);

    if (!res.success) {
      alert(res.error || "Gagal membuat user.");
      return;
    }

    setUsersList(prev => [...prev, {
      id: `prof-${Date.now()}`,
      name: newUserName,
      role: newUserRole,
      departmentId: newUserRole === "owner" ? null : newUserDept,
      avatarUrl: newUserAvatar || undefined
    }]);

    
    // Reset form
    setShowAddUserForm(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserRole("pic");
    setNewUserDept("");
    setNewUserAvatar("");

    alert(`User simulator "${newUserName}" berhasil dibuat dan disimpan ke database! (Email: ${newUserEmail})`);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (userId === currentProfile.id) {
      showToast("Anda tidak bisa menghapus profil simulator yang sedang aktif!", "error");
      return;
    }

    showConfirm({
      title: "Hapus Pengguna Simulator",
      message: `Apakah Anda yakin ingin menghapus user "${userName}" secara permanen?`,
      variant: "danger",
      confirmText: "Ya, Hapus",
      onConfirm: () => {
        setUsersList(prev => prev.filter(u => u.id !== userId));
        if (ENABLE_DATABASE) {
          supabase.from("profiles").delete().eq("id", userId)
            .then(({ error }) => { if (error) console.error("Supabase delete user error:", error); });
        }
        showToast(`User "${userName}" berhasil dihapus.`, "success");
      }
    });
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;

    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: newDeptName
    };

    setDeptsList(prev => [...prev, newDept]);
    setNewDeptName("");
    alert(`Divisi "${newDeptName}" berhasil dibuat!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="border-b border-slate-100 dark:border-zinc-800 pb-5">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {language === "id" ? "Pengaturan" : "Settings"}
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm mt-1">
          {language === "id" 
            ? "Kelola detail akun, simulator pengguna, divisi, dan sistem." 
            : "Manage account details, user simulator, divisions, and system settings."}
        </p>
      </div>

      {/* Tabs Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Tabs on Left */}
        <div className="lg:col-span-1 space-y-1.5">
          {[
            { id: "profile", label: language === "id" ? "Profil Akun" : "Account Profile", icon: User },
            { id: "system", label: language === "id" ? "Sistem, Bahasa & Tema" : "System, Lang & Theme", icon: Settings },
            { id: "notifications", label: language === "id" ? "Notifikasi Email" : "Email Notifications", icon: Bell },
            ...(isOwnerOrDev ? [
              { id: "users", label: language === "id" ? "Kelola User" : "Manage Users", icon: Users },
              { id: "divisions", label: language === "id" ? "Kelola Divisi" : "Manage Divisions", icon: Layers }
            ] : [])
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? "tab-active-glass shadow-xs text-white"
                    : "border-transparent text-slate-600 dark:text-zinc-400 hover:bg-slate-100/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Area on Right */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-800 rounded-xl shadow-sm p-6 md:p-8">
            
            {/* 1. Tab Profile */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Informasi Profil</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Informasi akun dan kredensial pengguna.</p>
                  </div>

                  {!isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-white text-xs font-extrabold rounded-xl transition-all shadow-2xs cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 text-slate-700 dark:text-white" /> Edit Akun
                    </button>
                  )}
                </div>

                {/* View Mode (Clean Typography - No Inner Box, No Inputs) */}
                {!isEditingProfile ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-2">
                    {/* Large Avatar */}
                    <div className="relative shrink-0">
                      {profileAvatarUrl ? (
                        <img
                          src={profileAvatarUrl}
                          alt="Avatar preview"
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-slate-200 dark:border-zinc-700 shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 flex items-center justify-center shadow-md">
                          <span className="text-3xl sm:text-4xl font-black text-slate-700 dark:text-white">
                            {profileName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Profile Info Details */}
                    <div className="flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                          {profileName}
                        </h2>
                        <span className="px-3 py-1 text-[10px] font-black uppercase rounded-full badge-glass">
                          {currentProfile.role}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-slate-600 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                          <span>{profileEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                          <span>{getDeptName(currentProfile.departmentId, currentProfile.role)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Edit Mode Inputs */
                  <div className="bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-5 md:p-6 space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800 pb-3">
                      <span className="text-xs font-extrabold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                        Edit Detail Profil & Password
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
                      >
                        <X className="w-3.5 h-3.5" /> Batal
                      </button>
                    </div>

                    {/* 1. Foto Profil (Avatar) Section - AT TOP */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-2 border-b border-slate-200/60 dark:border-zinc-800/80">
                      <div className="relative shrink-0">
                        {profileAvatarUrl ? (
                          <img
                            src={profileAvatarUrl}
                            alt="Avatar preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-zinc-700 shadow-md"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 flex items-center justify-center shadow-md">
                            <span className="text-xl font-black text-slate-700 dark:text-white">
                              {profileName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Foto Profil (Avatar)
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFile}
                            className="hidden"
                            id="avatar-file-input"
                          />
                          <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all cursor-pointer shadow-2xs"
                          >
                            <Camera className="w-3.5 h-3.5" /> Pilih foto dari komputer...
                          </button>
                          {profileAvatarUrl && (
                            <button
                              type="button"
                              onClick={() => setProfileAvatarUrl("")}
                              className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                            >
                              Hapus Foto
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. Username & Email Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Nama Lengkap (Username)
                        </label>
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Alamat Email
                        </label>
                        <input
                          type="email"
                          required
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white font-semibold"
                        />
                      </div>
                    </div>

                    {/* Change Password Section Inside Edit Mode */}
                    <div className="border-t border-slate-200/60 dark:border-zinc-800/80 pt-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-slate-700 dark:text-white" /> Ganti Password Akun (Opsional)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password Baru</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Konfirmasi Password Baru</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-3 border-t border-slate-200/60 dark:border-zinc-800">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-extrabold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}

            {/* 2. Tab System, Language & Theme */}
            {activeTab === "system" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* 1. Language Setting */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {language === "id" ? "Bahasa Aplikasi" : "Application Language"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === "id" 
                        ? "Pilih bahasa tampilan untuk seluruh navigasi dan menu." 
                        : "Select the display language for all menus and navigation."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <button
                      type="button"
                      onClick={() => updateLanguage("id")}
                      className={`flex items-center justify-between p-4 border rounded-2xl transition-all cursor-pointer select-none ${
                        language === "id"
                          ? "tab-active-glass text-white font-extrabold shadow-xs"
                          : "border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center gap-2">🇮🇩 Bahasa Indonesia</span>
                      {language === "id" && <Check className="w-4 h-4 text-white shrink-0 stroke-[3]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateLanguage("en")}
                      className={`flex items-center justify-between p-4 border rounded-2xl transition-all cursor-pointer select-none ${
                        language === "en"
                          ? "tab-active-glass text-white font-extrabold shadow-xs"
                          : "border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center gap-2">🇬🇧 English</span>
                      {language === "en" && <Check className="w-4 h-4 text-white shrink-0 stroke-[3]" />}
                    </button>
                  </div>
                </div>

                {/* 2. Theme Setting */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {language === "id" ? "Tema Tampilan" : "Appearance Theme"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === "id"
                        ? "Pilih antara tema terang atau gelap untuk kenyamanan mata Anda."
                        : "Choose between light or dark mode for your viewing comfort."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <button
                      type="button"
                      onClick={() => updateTheme("light")}
                      className={`flex items-center justify-between p-4 border rounded-2xl transition-all cursor-pointer select-none ${
                        theme === "light"
                          ? "tab-active-glass text-white font-extrabold shadow-xs"
                          : "border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center gap-2">☀️ {language === "id" ? "Mode Terang" : "Light Mode"}</span>
                      {theme === "light" && <Check className="w-4 h-4 text-white shrink-0 stroke-[3]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTheme("dark")}
                      className={`flex items-center justify-between p-4 border rounded-2xl transition-all cursor-pointer select-none ${
                        theme === "dark"
                          ? "tab-active-glass text-white font-extrabold shadow-xs"
                          : "border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center gap-2">🌙 {language === "id" ? "Mode Gelap" : "Dark Mode"}</span>
                      {theme === "dark" && <Check className="w-4 h-4 text-white shrink-0 stroke-[3]" />}
                    </button>
                  </div>
                </div>

                {/* 3. Accessibility & UI Scaling Settings */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      ♿ Pengaturan Aksesibilitas & Tampilan UI
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sesuaikan skala font, kerapatan antarmuka, kontras warna, dan efek animasi untuk kenyamanan membaca.
                    </p>
                  </div>

                  {/* A. Font Size Selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                      Ukuran Teks / Font Size
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "normal", label: "Normal (100%)", sub: "Ukuran standar aplikasi" },
                        { id: "large", label: "Besar (110%)", sub: "Teks lebih mudah dibaca" },
                        { id: "xlarge", label: "Sangat Besar (120%)", sub: "Kenyamanan ekstra penglihatan" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => updateFontSize(item.id as "normal" | "large" | "xlarge")}
                          className={`p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                            fontSize === item.id
                              ? "tab-active-glass text-white font-extrabold shadow-xs"
                              : "border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black">{item.label}</span>
                            {fontSize === item.id && <Check className="w-4 h-4 text-white shrink-0 stroke-[3]" />}
                          </div>
                          <p className={`text-[10px] mt-1 ${fontSize === item.id ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
                            {item.sub}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* B. UI Density Selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                      Kerapatan Tata Letak / UI Density
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "compact", label: "Rapat (Compact)", sub: "Tampilan padat & efisien" },
                        { id: "normal", label: "Standar (Normal)", sub: "Jarak spasi seimbang" },
                        { id: "comfortable", label: "Longgar (Comfortable)", sub: "Ruang spasi lega & santai" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => updateUiDensity(item.id as "compact" | "normal" | "comfortable")}
                          className={`p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                            uiDensity === item.id
                              ? "tab-active-glass text-white font-extrabold shadow-xs"
                              : "border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black">{item.label}</span>
                            {uiDensity === item.id && <Check className="w-4 h-4 text-white shrink-0 stroke-[3]" />}
                          </div>
                          <p className={`text-[10px] mt-1 ${uiDensity === item.id ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
                            {item.sub}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* C. Visual Toggles: High Contrast & Reduce Motion */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 border border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/60 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Kontras Tinggi (High Contrast)</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Mempertegas pembatas garis dan perbedaan warna elemen.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateHighContrast(!highContrast)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                          highContrast ? "bg-red-600" : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          highContrast ? "translate-x-6" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    <div className="p-4 border border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/60 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Kurangi Animasi (Reduce Motion)</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Menonaktifkan efek gerakan melayang & transisi cepat.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateReduceMotion(!reduceMotion)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                          reduceMotion ? "bg-red-600" : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          reduceMotion ? "translate-x-6" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Local Dummy Data Testing & Reset */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        {language === "id" ? "Mode Data Dummy Lokal (Aktif)" : "Local Dummy Data Mode (Active)"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                      {language === "id" ? "Pengujian & Reset Data Dummy" : "Dummy Data Testing & Reset"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === "id"
                        ? "Aplikasi saat ini berjalan 100% menggunakan data dummy lokal JavaScript (tanpa database cloud). Anda dapat mereset seluruh data (Rocks, Todos, Issues, Metrik, Headlines) ke kondisi awal kapan saja."
                        : "The application is currently running 100% with local JavaScript dummy data (no cloud database). You can reset all data (Rocks, Todos, Issues, Metrics, Headlines) back to initial default seed at any time."}
                    </p>
                  </div>

                  <div className="p-4 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {language === "id" ? "Reset ke Data Dummy Bawaan" : "Reset to Default Dummy Data"}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {language === "id"
                          ? "Hapus perubahan pengujian lokal dan muat ulang data dummy bawaan lengkap (5 divisi, target Q3, dsb)."
                          : "Wipe local testing changes and reload complete default dummy seed data."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        showConfirm({
                          title: language === "id" ? "Reset ke Data Dummy Bawaan" : "Reset to Default Dummy Data",
                          message: language === "id"
                            ? "Apakah Anda yakin ingin mereset seluruh data (Rocks, Scoreboard, Todos, Issues, Headlines) kembali ke data dummy bawaan?"
                            : "Are you sure you want to reset all data back to default dummy seed data?",
                          variant: "danger",
                          confirmText: language === "id" ? "Ya, Reset Sekarang" : "Yes, Reset Now",
                          onConfirm: () => {
                            resetToDummyData();
                            showToast(
                              language === "id" ? "Seluruh data telah direset ke data dummy bawaan!" : "All data has been reset to default dummy data!",
                              "success"
                            );
                          }
                        });
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {language === "id" ? "Reset Data Dummy" : "Reset Dummy Data"}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 4. Tab Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Bell className="w-5 h-5 text-red-500" />
                      Pengaturan Notifikasi Email
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isDeveloper 
                        ? "Kelola status aktif, daftar alamat email penerima (multi-email), filter kategori, dan jadwal pengiriman." 
                        : "Aktifkan atau matikan saklar utama notifikasi email untuk akun Anda."}
                    </p>
                  </div>

                  {/* Test Email Button (Developer Only) */}
                  {isDeveloper && (
                    <button
                      type="button"
                      disabled={isSendingTest || !emailNotifSettings.enabled}
                      onClick={async () => {
                        setIsSendingTest(true);
                        const res = await sendEmailNotification({
                          categoryKey: "test",
                          subject: "🧪 [Uji Coba System] Tes Notifikasi Email Nasi Gerilya",
                          title: "Uji Coba Sistem Notifikasi Email",
                          category: "TESTING NOTIFIKASI",
                          departmentName: "Developer / System Test",
                          authorName: currentProfile.name,
                          details: `Pesan uji coba berhasil terkirim dari sistem Scoreboard Nasi Gerilya pada ${new Date().toLocaleString("id-ID")}.\n\nJika Anda menerima pesan ini, artinya integrasi Resend API & alamat penerima email (${emailNotifSettings.targetEmail}) SUDAH 100% AKTIF dan BEKERJA DENGAN BAIK! 🎉`,
                          actionUrl: typeof window !== "undefined" ? window.location.origin : undefined
                        });
                        setIsSendingTest(false);

                        if (res.success) {
                          showToast(`✅ Email Uji Coba Berhasil Dikirim ke: ${emailNotifSettings.targetEmail}! Cek Inbox/Spam.`, "success");
                        } else {
                          showToast(`⚠️ Gagal Kirim Email Uji Coba: ${res.error}`, "error");
                        }
                      }}
                      className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                        isSendingTest || !emailNotifSettings.enabled
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800"
                          : "bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-600/20 cursor-pointer"
                      }`}
                    >
                      {isSendingTest ? "⏳ Mengirim..." : "🧪 Kirim Email Uji Coba"}
                    </button>
                  )}
                </div>

                {/* Status Indicator & Saklar Master Email (Visible for ALL roles: Owner, PIC, Developer) */}
                <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Status Saklar Notifikasi Email</h4>
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded uppercase ${
                        emailNotifSettings.enabled
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300"
                      }`}>
                        {emailNotifSettings.enabled ? "SYSTEM ACTIVE" : "SYSTEM DISABLED"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {emailNotifSettings.enabled 
                        ? "Notifikasi email sedang AKTIF secara global. Pesan otomatis akan terkirim saat ada event baru." 
                        : "Notifikasi email sedang MATI (OFF). Seluruh pengiriman pesan email akan dihentikan."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateEmailNotifSettings({ enabled: !emailNotifSettings.enabled })}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm flex-shrink-0 ${
                      emailNotifSettings.enabled
                        ? "bg-emerald-600 text-white hover:bg-emerald-500"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {emailNotifSettings.enabled ? "HIDUP (ON)" : "MATI (OFF)"}
                  </button>
                </div>

                {/* Advanced Settings (LOCKED for Owner & PIC, ONLY unlocked for DEVELOPER) */}
                {isDeveloper ? (
                  <div className="space-y-8 animate-in fade-in duration-150">
                    {/* Alamat Email Penerima (Multi-Email) */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        Alamat Email Penerima Notifikasi <span className="text-red-500">(Bisa Banyak Email)</span>
                      </label>
                      <input
                        type="text"
                        value={emailNotifSettings.targetEmail}
                        onChange={(e) => updateEmailNotifSettings({ targetEmail: e.target.value })}
                        placeholder="contoh: haryswork06@gmail.com, owner@nasigerilya.com"
                        className="w-full max-w-lg px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
                      />
                      <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl space-y-1 text-[11px] text-emerald-900 dark:text-emerald-300">
                        <p className="font-bold flex items-center gap-1.5">
                          ✅ Gmail SMTP Server Aktif (databasegerilya@gmail.com)
                        </p>
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium">
                          Sistem pengirim menggunakan Gmail SMTP terverifikasi. Anda dapat memasukkan alamat email asli manapun (misal <code>haryswork06@gmail.com</code>) atau banyak email yang dipisahkan dengan koma (<code>,</code>).
                        </p>
                      </div>
                    </div>

                    {/* Filter Kategori Notifikasi */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                        Kategori Notifikasi Email (Filter)
                      </h4>

                      <div className="space-y-3 max-w-md">
                        {/* Toggle Issues */}
                        <div className="flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            🚨 Laporan Issue / Kendala Baru
                          </span>
                          <input
                            type="checkbox"
                            checked={emailNotifSettings.notifyIssues}
                            onChange={(e) => updateEmailNotifSettings({ notifyIssues: e.target.checked })}
                            className="w-4 h-4 text-red-600 rounded cursor-pointer"
                          />
                        </div>

                        {/* Toggle Headlines */}
                        <div className="flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            📢 Headline / Pengumuman Baru
                          </span>
                          <input
                            type="checkbox"
                            checked={emailNotifSettings.notifyHeadlines}
                            onChange={(e) => updateEmailNotifSettings({ notifyHeadlines: e.target.checked })}
                            className="w-4 h-4 text-red-600 rounded cursor-pointer"
                          />
                        </div>

                        {/* Toggle Todos */}
                        <div className="flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            📋 Todo List & Tugas Baru
                          </span>
                          <input
                            type="checkbox"
                            checked={emailNotifSettings.notifyTodos}
                            onChange={(e) => updateEmailNotifSettings({ notifyTodos: e.target.checked })}
                            className="w-4 h-4 text-red-600 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pengaturan Jam / Jadwal Pengiriman */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                        Jadwal & Waktu Pengiriman
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                        <button
                          type="button"
                          onClick={() => updateEmailNotifSettings({ timingMode: "instant" })}
                          className={`p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                            emailNotifSettings.timingMode === "instant"
                              ? "border-red-500 bg-red-500/5 text-slate-900 dark:text-white font-bold ring-2 ring-red-500/20"
                              : "border-slate-200 bg-white text-slate-600 dark:bg-slate-950 dark:border-slate-800"
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center gap-1.5">⚡ Instan (Real-Time)</div>
                          <p className="text-[10px] text-slate-400 mt-1">Email langsung dikirim begitu kejadian terjadi.</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateEmailNotifSettings({ timingMode: "scheduled" })}
                          className={`p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                            emailNotifSettings.timingMode === "scheduled"
                              ? "border-red-500 bg-red-500/5 text-slate-900 dark:text-white font-bold ring-2 ring-red-500/20"
                              : "border-slate-200 bg-white text-slate-600 dark:bg-slate-950 dark:border-slate-800"
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center gap-1.5">⏰ Jam Tertentu</div>
                          <p className="text-[10px] text-slate-400 mt-1">Dikirimkan sesuai jadwal jam harian.</p>
                        </button>
                      </div>

                      {emailNotifSettings.timingMode === "scheduled" && (
                        <div className="space-y-2 max-w-xs animate-in slide-in-from-top-2 duration-150">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Jam Pengiriman Harian (WIB)</label>
                          <select
                            value={emailNotifSettings.scheduledTime?.slice(0, 2) ? `${emailNotifSettings.scheduledTime.slice(0, 2)}:00` : "12:00"}
                            onChange={(e) => updateEmailNotifSettings({ scheduledTime: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20"
                          >
                            <option value="07:00">07:00 WIB (Pagi)</option>
                            <option value="08:00">08:00 WIB (Pagi)</option>
                            <option value="09:00">09:00 WIB (Pagi)</option>
                            <option value="10:00">10:00 WIB (Pagi)</option>
                            <option value="11:00">11:00 WIB (Siang)</option>
                            <option value="12:00">12:00 WIB (Siang - Default)</option>
                            <option value="13:00">13:00 WIB (Siang)</option>
                            <option value="14:00">14:00 WIB (Siang)</option>
                            <option value="15:00">15:00 WIB (Sore)</option>
                            <option value="16:00">16:00 WIB (Sore)</option>
                            <option value="17:00">17:00 WIB (Sore)</option>
                            <option value="18:00">18:00 WIB (Malam)</option>
                            <option value="19:00">19:00 WIB (Malam)</option>
                            <option value="20:00">20:00 WIB (Malam)</option>
                          </select>
                          <p className="text-[10px] text-slate-500 font-medium">
                            💡 Server otomatis mengirim 1x email Rangkuman Harian setiap pukul <strong>{emailNotifSettings.scheduledTime?.slice(0, 2) || "12"}:00 WIB</strong>.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Manual Daily Summary Dispatch Card with Custom Note */}
                    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/60 dark:bg-slate-950/20 space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <Send className="w-4 h-4 text-red-500" />
                          Kirim Manual Laporan Rangkuman (On-Demand Digest)
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Kirimkan laporan rangkuman KPI, Issue, dan Todo saat ini secara instant tanpa perlu menunggu jadwal jam 12 siang.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Catatan & Pesan Tambahan Pengirim (Opsional)
                        </label>
                        <textarea
                          rows={2}
                          value={manualNote}
                          onChange={(e) => setManualNote(e.target.value)}
                          placeholder="Contoh: Catatan Owner: Harap prioritaskan penanganan Issue Mesin Kasir sebelum jam operasional esok..."
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-900 dark:text-white shadow-xs"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={isSendingManualDigest || !emailNotifSettings.enabled}
                          onClick={async () => {
                            setIsSendingManualDigest(true);
                            try {
                              const res = await fetch("/api/cron/daily-digest", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  customMessage: manualNote,
                                  customRecipient: emailNotifSettings.targetEmail
                                })
                              });
                              const data = await res.json();
                              setIsSendingManualDigest(false);

                              if (res.ok && data.success) {
                                showToast(`✅ Laporan Rangkuman Scoreboard Berhasil Dikirim ke Email!`, "success");
                                setManualNote("");
                              } else {
                                showToast(`⚠️ Gagal Mengirim Laporan Rangkuman: ${data.error || "Error"}`, "error");
                              }
                            } catch (e: any) {
                              setIsSendingManualDigest(false);
                              showToast(`⚠️ Error: ${e.message}`, "error");
                            }
                          }}
                          className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                            isSendingManualDigest || !emailNotifSettings.enabled
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800"
                              : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 cursor-pointer shadow-sm"
                          }`}
                        >
                          {isSendingManualDigest ? "⏳ Sedang Mengirim Laporan..." : "📤 Kirim Laporan Rangkuman Sekarang"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border border-amber-200 dark:border-amber-900/40 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 space-y-1">
                    <h5 className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      🔒 Pengaturan Lanjutan Dikunci Khusus Developer
                    </h5>
                    <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed">
                      Daftar email penerima, kategori notifikasi, dan jadwal jam pengiriman dikonfigurasi secara langsung oleh Developer. Sebagai <strong>{currentProfile.role.toUpperCase()}</strong>, Anda hanya dapat menghidupkan atau mematikan saklar notifikasi di atas.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. Tab Manage Users (Owner/Dev Only) */}
            {activeTab === "users" && isOwnerOrDev && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Manajemen Pengguna</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Buat, kelola, dan hapus user simulator dalam sistem.</p>
                  </div>
                  <button
                    onClick={() => setShowAddUserForm(!showAddUserForm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-500 shadow-sm shadow-red-650/10 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah User
                  </button>
                </div>

                {/* Add User Form Inline */}
                {showAddUserForm && (
                  <form onSubmit={handleAddUser} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-4 animate-in slide-in-from-top-3 duration-200">
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Form Tambah User Baru</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Pengguna</label>
                        <input
                          type="text"
                          required
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="Masukkan nama lengkap..."
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Alamat Email (Login)</label>
                        <input
                          type="email"
                          required
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="contoh: user@nasigerilya.com"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Password Login</label>
                        <input
                          type="password"
                          required
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Role Akses</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value as Profile["role"])}
                          className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none text-slate-900 dark:text-white"
                        >
                          <option value="pic">PIC (Division Manager)</option>
                          <option value="owner">Owner (Global Admin)</option>
                        </select>
                      </div>

                      {newUserRole === "pic" && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Divisi Penempatan</label>
                          <select
                            required
                            value={newUserDept}
                            onChange={(e) => setNewUserDept(e.target.value)}
                            className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none text-slate-900 dark:text-white"
                          >
                            <option value="">Pilih Divisi...</option>
                            {deptsList.map((d) => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className={newUserRole === "owner" ? "md:col-span-2" : ""}>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Avatar Image URL (Opsional)</label>
                        <input
                          type="text"
                          value={newUserAvatar}
                          onChange={(e) => setNewUserAvatar(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setShowAddUserForm(false)}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                      >
                        Tambah User
                      </button>
                    </div>
                  </form>
                )}

                {/* Desktop User List Table */}
                <div className="hidden md:block border border-slate-150 dark:border-slate-805 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-805 text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                        <th className="p-3">Nama</th>
                        <th className="p-3 text-center w-[120px]">Role</th>
                        <th className="p-3 text-center w-[140px]">Divisi</th>
                        <th className="p-3 text-center w-[80px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {usersList.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10">
                          <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">
                            <div className="flex items-center gap-2">
                              {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                              {user.name}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase rounded ${
                              user.role === "owner" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3 text-center font-medium text-slate-500">
                            {getDeptName(user.departmentId, user.role)}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded"
                              title="Hapus User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile User List Cards */}
                <div className="block md:hidden space-y-3">
                  {usersList.map((user) => (
                    <div key={user.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{getDeptName(user.departmentId, user.role)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase rounded ${
                            user.role === "owner" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                          }`}>
                            {user.role}
                          </span>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-lg"
                            title="Hapus User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Tab Manage Divisions (Owner/Dev Only) */}
            {activeTab === "divisions" && isOwnerOrDev && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Kelola Divisi Operasional</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tambah dan pantau divisi yang terdaftar di Nasi Gerilya.</p>
                </div>

                {/* Add Division Form */}
                <form onSubmit={handleAddDept} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="Contoh: Barista, Delivery..."
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Divisi
                  </button>
                </form>

                {/* Desktop Division List Table */}
                <div className="hidden md:block border border-slate-150 dark:border-slate-805 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-805 text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                        <th className="p-3">ID Divisi</th>
                        <th className="p-3">Nama Divisi</th>
                        <th className="p-3 text-center w-[120px]">Jumlah User</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {deptsList.map((dept) => {
                        const usersCount = usersList.filter(u => u.departmentId === dept.id).length;
                        return (
                          <tr key={dept.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10">
                            <td className="p-3 font-mono text-slate-400 text-[10px]">{dept.id}</td>
                            <td className="p-3 font-semibold text-slate-850 dark:text-slate-250">{dept.name}</td>
                            <td className="p-3 text-center font-bold text-slate-500">{usersCount} PIC</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Division List Cards */}
                <div className="block md:hidden space-y-3">
                  {deptsList.map((dept) => {
                    const usersCount = usersList.filter(u => u.departmentId === dept.id).length;
                    return (
                      <div key={dept.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{dept.name}</h4>
                          <p className="font-mono text-[10px] text-slate-400 mt-0.5">{dept.id}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-lg">
                          {usersCount} PIC
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-250/20 rounded-2xl flex gap-3 text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed">
                    <strong>PENTING:</strong> Divisi yang terdaftar di atas secara otomatis di-restrict oleh RLS Postgres. Mengubah nama divisi di atas akan memengaruhi penyaringan data PIC terkait secara realtime.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
