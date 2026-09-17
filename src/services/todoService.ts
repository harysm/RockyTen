import { supabase, ENABLE_DATABASE } from "@/lib/supabase";
import { Todo, AttachmentInfo } from "@/types";

export const fetchTodosFromDb = async (): Promise<Todo[]> => {
  if (!ENABLE_DATABASE) return [];
  try {
    const { data: dbTodos, error } = await supabase.from("todos").select("*");
    if (error) {
      console.error("Supabase fetchTodos error:", error);
      return [];
    }
    if (dbTodos && Array.isArray(dbTodos)) {
      return dbTodos.map(t => {
        let atts: AttachmentInfo[] = [];
        if (t.attachments && Array.isArray(t.attachments)) {
          atts = t.attachments;
        }
        return {
          id: t.id,
          departmentId: t.department_id,
          title: t.title,
          description: t.description || undefined,
          priority: t.priority,
          deadline: t.deadline,
          status: t.status,
          createdBy: t.created_by,
          convertedToMetricId: t.converted_to_metric_id || undefined,
          attachments: atts
        };
      });
    }
    return [];
  } catch (e) {
    console.error("fetchTodosFromDb exception:", e);
    return [];
  }
};

export const insertTodoToDb = async (todo: Todo): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const payload = {
      id: todo.id,
      department_id: todo.departmentId,
      title: todo.title,
      description: todo.description || null,
      priority: todo.priority,
      deadline: todo.deadline || null,
      status: todo.status,
      created_by: todo.createdBy || null,
      converted_to_metric_id: todo.convertedToMetricId || null,
      attachments: todo.attachments || []
    };
    const { error } = await supabase.from("todos").insert(payload);
    if (error) {
      console.error("Supabase insertTodoToDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("insertTodoToDb exception:", e);
    return false;
  }
};

export const updateTodoInDb = async (todoId: string, payload: Partial<Todo>): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const dbPayload: any = {};
    if (payload.title !== undefined) dbPayload.title = payload.title;
    if (payload.description !== undefined) dbPayload.description = payload.description;
    if (payload.priority !== undefined) dbPayload.priority = payload.priority;
    if (payload.deadline !== undefined) dbPayload.deadline = payload.deadline;
    if (payload.status !== undefined) dbPayload.status = payload.status;
    if (payload.departmentId !== undefined) dbPayload.department_id = payload.departmentId;
    if (payload.convertedToMetricId !== undefined) dbPayload.converted_to_metric_id = payload.convertedToMetricId;

    const { error } = await supabase.from("todos").update(dbPayload).eq("id", todoId);
    if (error) {
      console.error("Supabase updateTodoInDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("updateTodoInDb exception:", e);
    return false;
  }
};

export const deleteTodoFromDb = async (todoId: string): Promise<boolean> => {
  if (!ENABLE_DATABASE) return true;
  try {
    const { error } = await supabase.from("todos").delete().eq("id", todoId);
    if (error) {
      console.error("Supabase deleteTodoFromDb error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("deleteTodoFromDb exception:", e);
    return false;
  }
};
