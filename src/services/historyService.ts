import { supabase, ENABLE_DATABASE } from "@/lib/supabase";
import { HistoryLog } from "@/types";

export const fetchHistoryLogsFromDb = async (): Promise<HistoryLog[]> => {
  if (!ENABLE_DATABASE) return [];
  try {
    const { data: dbLogs, error } = await supabase
      .from("history_logs")
      .select("id, profile_id, profile_name, department_id, action, details, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Supabase fetchHistoryLogs error:", error);
      return [];
    }

    if (dbLogs && Array.isArray(dbLogs)) {
      return dbLogs.map(l => ({
        id: l.id,
        profileId: l.profile_id || "prof-unknown",
        profileName: l.profile_name || "System User",
        departmentId: l.department_id || undefined,
        action: l.action || "Log Action",
        details: l.details || "",
        createdAt: l.created_at || new Date().toISOString()
      }));
    }
    return [];
  } catch (e) {
    console.error("fetchHistoryLogsFromDb exception:", e);
    return [];
  }
};

export const insertHistoryLogToDb = async (log: HistoryLog): Promise<void> => {
  if (!ENABLE_DATABASE) return;
  try {
    const payload = {
      id: log.id,
      profile_id: log.profileId,
      profile_name: log.profileName,
      department_id: log.departmentId || null,
      action: log.action,
      details: log.details,
      created_at: log.createdAt
    };
    const { error } = await supabase.from("history_logs").insert(payload);
    if (error) {
      console.error("Supabase insertHistoryLogToDb error:", error);
    }
  } catch (e) {
    console.error("insertHistoryLogToDb exception:", e);
  }
};
