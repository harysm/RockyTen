import { supabase, ENABLE_DATABASE } from "@/lib/supabase";
import { Rock } from "@/types";

export const fetchRocksFromDb = async (): Promise<Rock[]> => {
  if (!ENABLE_DATABASE) return [];
  try {
    const { data, error } = await supabase.from("rocks").select("*").order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase fetchRocks error (fallback to local if table not ready):", error.message);
      return [];
    }
    if (data && Array.isArray(data)) {
      return data.map((r: any) => ({
        id: r.id,
        departmentId: r.department_id,
        title: r.title,
        description: r.description || undefined,
        quarter: r.quarter || "Q3",
        year: r.year ? Number(r.year) : 2026,
        status: r.status || "on_track",
        picId: r.pic_id,
        picName: r.pic_name,
        dueDate: r.due_date || "",
        createdAt: r.created_at || new Date().toISOString()
      }));
    }
    return [];
  } catch (e) {
    console.warn("fetchRocksFromDb exception:", e);
    return [];
  }
};

export const insertRockToDb = async (rock: Rock): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const { error } = await supabase.from("rocks").insert({
      id: rock.id,
      department_id: rock.departmentId,
      title: rock.title,
      description: rock.description || null,
      quarter: rock.quarter,
      year: rock.year,
      status: rock.status,
      pic_id: rock.picId,
      pic_name: rock.picName,
      due_date: rock.dueDate,
      created_at: rock.createdAt
    });
    if (error) {
      console.warn("Supabase insertRock error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("insertRockToDb exception:", e);
    return false;
  }
};

export const updateRockInDb = async (rock: Rock): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const { error } = await supabase.from("rocks").update({
      title: rock.title,
      description: rock.description || null,
      quarter: rock.quarter,
      year: rock.year,
      status: rock.status,
      pic_id: rock.picId,
      pic_name: rock.picName,
      due_date: rock.dueDate
    }).eq("id", rock.id);
    if (error) {
      console.warn("Supabase updateRock error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("updateRockInDb exception:", e);
    return false;
  }
};

export const deleteRockFromDb = async (id: string): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const { error } = await supabase.from("rocks").delete().eq("id", id);
    if (error) {
      console.warn("Supabase deleteRock error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("deleteRockFromDb exception:", e);
    return false;
  }
};
