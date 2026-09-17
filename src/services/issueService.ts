import { supabase, ENABLE_DATABASE } from "@/lib/supabase";
import { Issue, AttachmentInfo } from "@/types";

export const fetchIssuesFromDb = async (): Promise<Issue[]> => {
  if (!ENABLE_DATABASE) return [];
  try {
    const { data: dbIssues, error } = await supabase
      .from("issues")
      .select("id, department_id, title, description, priority, status, pic_id, pic_name, created_at, attachment_name, attachment_size, attachment_type");

    if (error) {
      console.error("Supabase fetchIssues error:", error);
      return [];
    }

    if (dbIssues && Array.isArray(dbIssues)) {
      return dbIssues.map(i => {
        let atts: AttachmentInfo[] = [];
        if (i.attachment_name) {
          atts = [{
            name: i.attachment_name,
            size: i.attachment_size || 0,
            type: i.attachment_type || "",
            dataUrl: undefined
          }];
        }
        return {
          id: i.id,
          departmentId: i.department_id,
          title: i.title,
          description: i.description || undefined,
          priority: i.priority,
          status: i.status,
          picId: i.pic_id,
          picName: i.pic_name,
          createdAt: i.created_at,
          attachments: atts
        };
      });
    }
    return [];
  } catch (e) {
    console.error("fetchIssuesFromDb exception:", e);
    return [];
  }
};

export const insertIssueToDb = async (issue: Issue): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const payload: any = {
      id: issue.id,
      department_id: issue.departmentId,
      title: issue.title,
      description: issue.description || null,
      priority: issue.priority,
      status: issue.status,
      pic_id: issue.picId || null,
      pic_name: issue.picName || null,
      created_at: issue.createdAt,
      attachments: issue.attachments || []
    };

    const { error } = await supabase.from("issues").insert(payload);
    if (error) {
      console.error("Supabase insertIssueToDb error:", error);
      delete payload.attachments;
      if (issue.attachments && issue.attachments.length > 0) {
        payload.attachment_name = issue.attachments[0].name;
        payload.attachment_size = issue.attachments[0].size;
        payload.attachment_type = issue.attachments[0].type;
        payload.attachment_data_url = issue.attachments[0].dataUrl;
      }
      await supabase.from("issues").insert(payload);
    }
    return true;
  } catch (e) {
    console.error("insertIssueToDb exception:", e);
    return false;
  }
};

export const updateIssueInDb = async (issueId: string, payload: Partial<Issue>): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const dbPayload: any = {};
    if (payload.title !== undefined) dbPayload.title = payload.title;
    if (payload.description !== undefined) dbPayload.description = payload.description;
    if (payload.priority !== undefined) dbPayload.priority = payload.priority;
    if (payload.status !== undefined) dbPayload.status = payload.status;
    if (payload.departmentId !== undefined) dbPayload.department_id = payload.departmentId;
    if (payload.picName !== undefined) dbPayload.pic_name = payload.picName;

    const { error } = await supabase.from("issues").update(dbPayload).eq("id", issueId);
    if (error) {
      console.error("Supabase updateIssueInDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("updateIssueInDb exception:", e);
    return false;
  }
};

export const deleteIssueFromDb = async (issueId: string): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const { error } = await supabase.from("issues").delete().eq("id", issueId);
    if (error) {
      console.error("Supabase deleteIssueFromDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("deleteIssueFromDb exception:", e);
    return false;
  }
};
