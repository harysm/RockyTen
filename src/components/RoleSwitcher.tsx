"use client";

import React, { useState } from "react";
import { useApp, Profile } from "@/context/AppContext";
import { Users, Shield, User, ChevronUp, ChevronDown, Terminal, Crown } from "lucide-react";

export const RoleSwitcher: React.FC = () => {
  const { currentProfile, setCurrentProfile, allProfiles, departments } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const getDeptName = (id: string | null) => {
    if (!id) return "Owner";
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : "PIC";
  };

  const handleProfileSelect = (profile: Profile) => {
    setCurrentProfile(profile);
    if (typeof window !== "undefined") {
      localStorage.setItem("currentProfile", JSON.stringify(profile));
    }
    setIsOpen(false);
  };

  const isDev = currentProfile.role === "developer";
  const isOwner = currentProfile.role === "owner";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-zinc-900 text-white shadow-xl hover:bg-zinc-800 border border-zinc-700/80 transition-all cursor-pointer"
      >
        {isDev ? (
          <Terminal className="w-4 h-4 text-blue-400" />
        ) : isOwner ? (
          <Crown className="w-4 h-4 text-amber-400" />
        ) : (
          <Users className="w-4 h-4 text-emerald-400" />
        )}
        <span className="text-xs font-semibold">
          RBAC: <strong className="text-white">{currentProfile.name}</strong> ({isDev ? "Developer" : isOwner ? "Owner" : `${getDeptName(currentProfile.departmentId)} PIC`})
        </span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-3 space-y-2 animate-in slide-in-from-bottom-3 duration-150">
          <div className="px-2 py-1.5 border-b border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Simulasi Hak Akses RBAC</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Uji isolasi data (Developer vs Owner vs PIC Divisi)</p>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1 pt-1">
            {allProfiles.map((profile) => {
              const isSelected = profile.id === currentProfile.id;
              const isPDev = profile.role === "developer";
              const isPOwner = profile.role === "owner";

              return (
                <button
                  key={profile.id}
                  onClick={() => handleProfileSelect(profile)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                    isSelected 
                      ? "bg-zinc-800 text-white border border-zinc-700 font-bold" 
                      : "hover:bg-zinc-800/60 text-zinc-300 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white leading-tight">{profile.name}</p>
                      <p className="text-[10px] text-zinc-400 font-medium">
                        {isPDev 
                          ? "Developer (Full Debug & Logs)" 
                          : isPOwner 
                          ? "Owner (Semua Divisi)" 
                          : `${getDeptName(profile.departmentId)} Division PIC`}
                      </p>
                    </div>
                  </div>

                  {isPDev ? (
                    <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  ) : isPOwner ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Shield className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
