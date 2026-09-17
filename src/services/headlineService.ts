import { supabase, ENABLE_DATABASE } from "@/lib/supabase";
import { Headline, AttachmentInfo } from "@/types";

export const fetchHeadlinesFromDb = async (): Promise<Headline[]> => {
  if (!ENABLE_DATABASE) return [];
  try {
    const { data: dbHeadlines, error } = await supabase
      .from("headlines")
      .select("id, department_id, title, content, category, author_id, author_name, created_at, attachment_name, attachment_size, attachment_type");

    if (error) {
      console.error("Supabase fetchHeadlines error:", error);
      return [];
    }

    if (dbHeadlines && Array.isArray(dbHeadlines)) {
      return dbHeadlines.map(h => {
        let atts: AttachmentInfo[] = [];
        if (h.attachment_name) {
          atts = [{
            name: h.attachment_name,
            size: h.attachment_size || 0,
            type: h.attachment_type || "",
            dataUrl: undefined
          }];
        }
        return {
          id: h.id,
          departmentId: h.department_id || null,
          title: h.title,
          content: h.content,
          category: h.category,
          authorId: h.author_id,
          authorName: h.author_name,
          createdAt: h.created_at,
          attachments: atts
        };
      });
    }
    return [];
  } catch (e) {
    console.error("fetchHeadlinesFromDb exception:", e);
    return [];
  }
};

export const insertHeadlineToDb = async (headline: Headline): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const payload: any = {
      id: headline.id,
      department_id: headline.departmentId || null,
      title: headline.title,
      content: headline.content,
      category: headline.category,
      author_id: headline.authorId,
      author_name: headline.authorName,
      created_at: headline.createdAt,
      attachments: headline.attachments || []
    };

    const { error } = await supabase.from("headlines").insert(payload);
    if (error) {
      console.error("Supabase insertHeadlineToDb error:", error);
      delete payload.attachments;
      if (headline.attachments && headline.attachments.length > 0) {
        payload.attachment_name = headline.attachments[0].name;
        payload.attachment_size = headline.attachments[0].size;
        payload.attachment_type = headline.attachments[0].type;
        payload.attachment_data_url = headline.attachments[0].dataUrl;
      }
      await supabase.from("headlines").insert(payload);
    }
    return true;
  } catch (e) {
    console.error("insertHeadlineToDb exception:", e);
    return false;
  }
};

export const updateHeadlineInDb = async (headlineId: string, payload: Partial<Headline>): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const dbPayload: any = {};
    if (payload.title !== undefined) dbPayload.title = payload.title;
    if (payload.content !== undefined) dbPayload.content = payload.content;
    if (payload.category !== undefined) dbPayload.category = payload.category;
    if (payload.departmentId !== undefined) dbPayload.department_id = payload.departmentId;

    const { error } = await supabase.from("headlines").update(dbPayload).eq("id", headlineId);
    if (error) {
      console.error("Supabase updateHeadlineInDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("updateHeadlineInDb exception:", e);
    return false;
  }
};

export const deleteHeadlineFromDb = async (headlineId: string): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const { error } = await supabase.from("headlines").delete().eq("id", headlineId);
    if (error) {
      console.error("Supabase deleteHeadlineFromDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("deleteHeadlineFromDb exception:", e);
    return false;
  }
};
