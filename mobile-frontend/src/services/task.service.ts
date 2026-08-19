import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";
import { Task } from "../types";

const SESSION_KEY = "@tasksync_session";
const TOKEN_KEY = "@tasksync_token";

/* ==========================================
   TIPOS DEL BACKEND
========================================== */

interface BackendUser {
  usuario_id?: number;
  id?: number;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  correo?: string;
}

interface BackendReminder {
  recordatorio_id: number;
  usuario_id: number;
  categoria_id: number | null;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  notificado: number | boolean;

  // NUEVO: estado de la tarea
  completado: number | boolean;
}

interface BackendResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

/* ==========================================
   OBTENER USUARIO ACTUAL
========================================== */

async function getCurrentUser(): Promise<BackendUser> {
  const session = await AsyncStorage.getItem(
    SESSION_KEY
  );

  if (!session) {
    throw new Error(
      "No existe una sesión activa."
    );
  }

  const user = JSON.parse(
    session
  ) as BackendUser;

  return user;
}

/* ==========================================
   OBTENER ID DEL USUARIO
========================================== */

async function getCurrentUserId(): Promise<number> {
  const user = await getCurrentUser();

  console.log(
    "Usuario guardado en sesión:",
    user
  );

  const userId =
    user.usuario_id ?? user.id;

  if (
    userId === undefined ||
    userId === null
  ) {
    throw new Error(
      "No se encontró el ID del usuario en la sesión."
    );
  }

  return Number(userId);
}

/* ==========================================
   OBTENER TOKEN
========================================== */

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(
    TOKEN_KEY
  );
}

/* ==========================================
   HEADERS
========================================== */

async function getHeaders() {
  const token = await getToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

/* ==========================================
   FECHA BACKEND -> FRONTEND
========================================== */

function parseBackendDate(
  fecha: string
) {
  if (!fecha) {
    return {
      dueDate: "",
      dueTime: "",
    };
  }

  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    const [datePart, timePart] =
      fecha.split("T");

    return {
      dueDate: datePart || "",

      dueTime: timePart
        ? timePart.substring(0, 5)
        : "",
    };
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  return {
    dueDate: `${year}-${month}-${day}`,
    dueTime: `${hours}:${minutes}`,
  };
}

/* ==========================================
   FECHA FRONTEND -> BACKEND
========================================== */

function buildBackendDate(
  dueDate?: string,
  dueTime?: string
) {
  const date =
    dueDate ||
    new Date()
      .toISOString()
      .split("T")[0];

  const time =
    dueTime || "00:00";

  return `${date}T${time}:00`;
}

/* ==========================================
   CONVERTIR ESTADO BACKEND -> FRONTEND
========================================== */

function parseCompleted(
  completado: number | boolean | undefined
): boolean {
  return (
    completado === true ||
    completado === 1
  );
}

/* ==========================================
   RECORDATORIO -> TASK
========================================== */

function reminderToTask(
  reminder: BackendReminder
): Task {
  const {
    dueDate,
    dueTime,
  } = parseBackendDate(
    reminder.fecha
  );

  return {
    id: String(
      reminder.recordatorio_id
    ),

    title: reminder.titulo,

    description:
      reminder.descripcion || "",

    dueDate,

    dueTime,

    // AHORA VIENE DESDE MYSQL
    completed: parseCompleted(
      reminder.completado
    ),

    priority: "Media",

    reminderEnabled: true,

    notificationId: undefined,
  } as Task;
}

/* ==========================================
   TASK SERVICE
========================================== */

export const taskService = {

  /* ========================================
     OBTENER TAREAS
  ======================================== */

  async getTasks(): Promise<Task[]> {
    try {
      const userId =
        await getCurrentUserId();

      const headers =
        await getHeaders();

      console.log(
        "Solicitando tareas del usuario:",
        userId
      );

      const response = await fetch(
        `${API_URL}/reminders/user/${userId}`,
        {
          method: "GET",
          headers,
        }
      );

      const result: BackendResponse<
        BackendReminder[]
      > = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "No se pudieron obtener las tareas."
        );
      }

      const reminders =
        result.data || [];

      return reminders.map(
        reminderToTask
      );

    } catch (error) {
      console.error(
        "Error al obtener tareas:",
        error
      );

      return [];
    }
  },

  /* ========================================
     CREAR TAREA
  ======================================== */

  async createTask(
    task: Omit<Task, "id">
  ): Promise<Task> {

    const userId =
      await getCurrentUserId();

    const headers =
      await getHeaders();

    const fecha =
      buildBackendDate(
        task.dueDate,
        task.dueTime
      );

    const response = await fetch(
      `${API_URL}/reminders`,
      {
        method: "POST",

        headers,

        body: JSON.stringify({
          usuario_id: userId,

          categoria_id: null,

          titulo: task.title,

          descripcion:
            task.description || null,

          fecha,

          // NUEVO
          completado: task.completed
            ? 1
            : 0,
        }),
      }
    );

    const result: BackendResponse<{
      recordatorio_id: number;
    }> = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "No se pudo crear la tarea."
      );
    }

    if (!result.data) {
      throw new Error(
        "El servidor no devolvió el ID de la tarea."
      );
    }

    return {
      ...task,

      id: String(
        result.data.recordatorio_id
      ),

      notificationId: undefined,
    } as Task;
  },

  /* ========================================
     ACTUALIZAR TAREA
  ======================================== */

  async updateTask(
    id: string,
    updatedFields: Partial<Task>
  ): Promise<Task | undefined> {

    const currentTask =
      await this.getTaskById(id);

    if (!currentTask) {
      return undefined;
    }

    const updatedTask: Task = {
      ...currentTask,
      ...updatedFields,
      id: currentTask.id,
    };

    const headers =
      await getHeaders();

    const fecha =
      buildBackendDate(
        updatedTask.dueDate,
        updatedTask.dueTime
      );

    console.log(
      "Actualizando tarea:",
      id,
      "completada:",
      updatedTask.completed
    );

    const response = await fetch(
      `${API_URL}/reminders/${id}`,
      {
        method: "PUT",

        headers,

        body: JSON.stringify({
          categoria_id: null,

          titulo:
            updatedTask.title,

          descripcion:
            updatedTask.description ||
            null,

          fecha,

          notificado: false,

          // IMPORTANTE
          completado:
            updatedTask.completed
              ? 1
              : 0,
        }),
      }
    );

    const result: BackendResponse<null> =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "No se pudo actualizar la tarea."
      );
    }

    return updatedTask;
  },

  /* ========================================
     ELIMINAR TAREA
  ======================================== */

  async deleteTask(
    id: string
  ): Promise<void> {

    const headers =
      await getHeaders();

    const response = await fetch(
      `${API_URL}/reminders/${id}`,
      {
        method: "DELETE",
        headers,
      }
    );

    const result: BackendResponse<null> =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "No se pudo eliminar la tarea."
      );
    }
  },

  /* ========================================
     OBTENER TAREA POR ID
  ======================================== */

  async getTaskById(
    id: string
  ): Promise<Task | undefined> {

    try {
      const headers =
        await getHeaders();

      const response = await fetch(
        `${API_URL}/reminders/${id}`,
        {
          method: "GET",
          headers,
        }
      );

      if (response.status === 404) {
        return undefined;
      }

      const result: BackendResponse<
        BackendReminder
      > = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "No se pudo obtener la tarea."
        );
      }

      if (!result.data) {
        return undefined;
      }

      return reminderToTask(
        result.data
      );

    } catch (error) {
      console.error(
        "Error al obtener tarea:",
        error
      );

      return undefined;
    }
  },

  /* ========================================
     DASHBOARD
  ======================================== */

  async getDashboard() {
    const tasks =
      await this.getTasks();

    return {
      totalTasks:
        tasks.length,

      completedTasks:
        tasks.filter(
          (task) => task.completed
        ).length,

      pendingTasks:
        tasks.filter(
          (task) => !task.completed
        ).length,

      recentTasks:
        tasks.slice(0, 5),
    };
  },
};