import { supabase, ENABLE_DATABASE } from "@/lib/supabase";
import { Metric, MetricValue } from "@/types";

export const fetchMetricsFromDb = async (): Promise<Metric[]> => {
  if (!ENABLE_DATABASE) return [];
  try {
    const { data: dbMetrics, error } = await supabase.from("metrics").select("*");
    if (error) {
      console.error("Supabase fetchMetrics error:", error);
      return [];
    }
    if (dbMetrics && Array.isArray(dbMetrics)) {
      return dbMetrics.map(m => ({
        id: m.id,
        departmentId: m.department_id,
        rockId: m.rock_id || null,
        name: m.name,
        target: Number(m.target),
        unit: m.unit,
        targetType: m.target_type,
        picId: m.pic_id,
        picName: m.pic_name,
        keterangan: m.keterangan || undefined,
        isActive: m.is_active !== undefined ? Boolean(m.is_active) : true,
        cycleType: (m.cycle_type as "monthly" | "special") || (m.deadline ? "special" : "monthly"),
        durationDays: m.duration_days ? Number(m.duration_days) : 7,
        deadline: m.deadline || undefined,
        createdAt: m.created_at || new Date().toISOString()
      }));
    }
    return [];
  } catch (e) {
    console.error("fetchMetricsFromDb exception:", e);
    return [];
  }
};

export const fetchMetricValuesFromDb = async (): Promise<MetricValue[]> => {
  if (!ENABLE_DATABASE) return [];
  try {
    const { data: dbValues, error } = await supabase.from("metric_values").select("*");
    if (error) {
      console.error("Supabase fetchMetricValues error:", error);
      return [];
    }
    if (dbValues && Array.isArray(dbValues)) {
      return dbValues.map(v => {
        let daily: (number | null)[] = Array(7).fill(null);
        if (v.daily_values && Array.isArray(v.daily_values)) {
          daily = v.daily_values;
        }
        return {
          id: v.id,
          metricId: v.metric_id,
          year: v.year,
          month: v.month,
          week: v.week,
          value: v.value !== null && v.value !== undefined ? Number(v.value) : null,
          inputtedBy: v.inputtedBy || undefined,
          updatedAt: v.updated_at || undefined,
          dailyValues: daily
        };
      });
    }
    return [];
  } catch (e) {
    console.error("fetchMetricValuesFromDb exception:", e);
    return [];
  }
};

export const insertMetricToDb = async (metric: Metric): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const payload = {
      id: metric.id,
      department_id: metric.departmentId,
      rock_id: metric.rockId || null,
      name: metric.name,
      target: metric.target,
      unit: metric.unit,
      target_type: metric.targetType,
      pic_id: metric.picId,
      pic_name: metric.picName,
      keterangan: metric.keterangan || null,
      is_active: metric.isActive ?? true,
      cycle_type: metric.cycleType || "monthly",
      duration_days: metric.durationDays || 7,
      deadline: metric.deadline || null,
      created_at: metric.createdAt
    };
    const { error } = await supabase.from("metrics").insert(payload);
    if (error) {
      console.error("Supabase insertMetricToDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("insertMetricToDb exception:", e);
    return false;
  }
};

export const updateMetricInDb = async (metricId: string, payload: Partial<Metric>): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const dbPayload: any = {};
    if (payload.name !== undefined) dbPayload.name = payload.name;
    if (payload.target !== undefined) dbPayload.target = payload.target;
    if (payload.unit !== undefined) dbPayload.unit = payload.unit;
    if (payload.targetType !== undefined) dbPayload.target_type = payload.targetType;
    if (payload.departmentId !== undefined) dbPayload.department_id = payload.departmentId;
    if (payload.picId !== undefined) dbPayload.pic_id = payload.picId;
    if (payload.picName !== undefined) dbPayload.pic_name = payload.picName;
    if (payload.rockId !== undefined) dbPayload.rock_id = payload.rockId;
    if (payload.keterangan !== undefined) dbPayload.keterangan = payload.keterangan;
    if (payload.isActive !== undefined) dbPayload.is_active = payload.isActive;
    if (payload.cycleType !== undefined) dbPayload.cycle_type = payload.cycleType;
    if (payload.durationDays !== undefined) dbPayload.duration_days = payload.durationDays;
    if (payload.deadline !== undefined) dbPayload.deadline = payload.deadline;

    const { error } = await supabase.from("metrics").update(dbPayload).eq("id", metricId);
    if (error) {
      console.error("Supabase updateMetricInDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("updateMetricInDb exception:", e);
    return false;
  }
};

export const deleteMetricFromDb = async (metricId: string): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    await supabase.from("metric_values").delete().eq("metric_id", metricId);
    const { error } = await supabase.from("metrics").delete().eq("id", metricId);
    if (error) {
      console.error("Supabase deleteMetricFromDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("deleteMetricFromDb exception:", e);
    return false;
  }
};

export const saveMetricValueToDb = async (val: MetricValue): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const payload = {
      id: val.id,
      metric_id: val.metricId,
      year: val.year,
      month: val.month,
      week: val.week,
      value: val.value,
      inputted_by: val.inputtedBy || null,
      updated_at: new Date().toISOString(),
      daily_values: val.dailyValues || Array(7).fill(null)
    };
    const { error } = await supabase.from("metric_values").upsert(payload);
    if (error) {
      console.error("Supabase saveMetricValueToDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("saveMetricValueToDb exception:", e);
    return false;
  }
};
