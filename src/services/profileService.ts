import { supabase, ENABLE_DATABASE } from "@/lib/supabase";
import { Profile } from "@/types";

export const fetchProfilesFromDb = async (): Promise<Profile[]> => {
  if (!ENABLE_DATABASE) return [];
  try {
    const { data: dbProfiles, error } = await supabase.from("profiles").select("*");
    if (error) {
      console.error("Supabase fetchProfiles error:", error);
      return [];
    }
    if (dbProfiles && Array.isArray(dbProfiles)) {
      return dbProfiles.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role,
        departmentId: p.department_id || null,
        avatarUrl: p.avatar_url || undefined,
        email: p.email || undefined,
        password: p.password || undefined
      }));
    }
    return [];
  } catch (e) {
    console.error("fetchProfilesFromDb exception:", e);
    return [];
  }
};

export const saveProfileToDb = async (profile: Profile): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const payload = {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      department_id: profile.departmentId,
      avatar_url: profile.avatarUrl || null,
      email: profile.email || null,
      password: profile.password || null
    };
    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) {
      console.error("Supabase saveProfileToDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("saveProfileToDb exception:", e);
    return false;
  }
};

export const deleteProfileFromDb = async (profileId: string): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const { error } = await supabase.from("profiles").delete().eq("id", profileId);
    if (error) {
      console.error("Supabase deleteProfileFromDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("deleteProfileFromDb exception:", e);
    return false;
  }
};
