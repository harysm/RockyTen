"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

export type NetworkStatus = "online" | "slow" | "offline";

export const NetworkStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<NetworkStatus>("online");
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const checkNetwork = async () => {
    if (typeof window === "undefined") return;
    if (!navigator.onLine) {
      setStatus("offline");
      setPingLatency(null);
      return;
    }

    const start = performance.now();
    try {
      const res = await fetch("/gerilya-logo-merah-transparent.svg?t=" + Date.now(), {
        method: "HEAD",
        cache: "no-store",
        signal: AbortSignal.timeout(3000)
      });
      const end = performance.now();
      const latency = Math.round(end - start);
      setPingLatency(latency);

      if (res.ok) {
        if (latency > 350) {
          setStatus("slow");
        } else {
          setStatus("online");
        }
      } else {
        setStatus("slow");
      }
    } catch (err) {
      if (!navigator.onLine) {
        setStatus("offline");
      } else {
        setStatus("slow");
      }
    }
  };

  useEffect(() => {
    checkNetwork();

    const handleOnline = () => checkNetwork();
    const handleOffline = () => {
      setStatus("offline");
      setPingLatency(null);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(checkNetwork, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getStatusDetails = () => {
    switch (status) {
      case "online":
        return {
          colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
          dotClass: "bg-emerald-500 animate-pulse",
          title: `Sinyal Aman (${pingLatency ? pingLatency + "ms" : "Online"})`,
          icon: <Wifi className="w-3.5 h-3.5" />
        };
      case "slow":
        return {
          colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
          dotClass: "bg-amber-500 animate-ping",
          title: `Koneksi Lambat (${pingLatency ? pingLatency + "ms" : "Slow"})`,
          icon: <Wifi className="w-3.5 h-3.5 text-amber-500" />
        };
      case "offline":
      default:
        return {
          colorClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
          dotClass: "bg-rose-500",
          title: "Offline - Tidak Ada Sinyal!",
          icon: <WifiOff className="w-3.5 h-3.5 text-rose-500" />
        };
    }
  };

  const details = getStatusDetails();

  return (
    <div
      title={details.title}
      className={`relative inline-flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl border ${details.colorClass} transition-all duration-300 shadow-2xs select-none cursor-pointer`}
      onClick={checkNetwork}
    >
      <div className="flex items-center justify-center">
        {details.icon}
      </div>
      <span className="text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline-block">
        {status === "online" ? (pingLatency ? `${pingLatency}ms` : "OK") : status === "slow" ? "SLOW" : "OFFLINE"}
      </span>
    </div>
  );
};

export default NetworkStatusBadge;
