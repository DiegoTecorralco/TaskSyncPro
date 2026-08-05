import AsyncStorage from "@react-native-async-storage/async-storage";

import { Task, User } from "../types";

const SESSION_KEY = "@tasksync_session";

async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await AsyncStorage.getItem(
      SESSION_KEY
    );

    if (!session) {
      return null;
    }

    return JSON.parse(session) as User;
  } catch (error) {
    console.error(
      "Error al obtener la sesión actual:",
      error
    );

    return null;
  }
}

async function getTasksStorageKey(): Promise<string> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error(
      "No existe una sesión activa."
    );
  }

  return `@tasksync_tasks_${currentUser.id}`;
}

async function saveTasks(
  tasks: Task[]
): Promise<void> {
  const storageKey =
    await getTasksStorageKey();

  await AsyncStorage.setItem(
    storageKey,
    JSON.stringify(tasks)
  );
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const storageKey =
        await getTasksStorageKey();

      const data =
        await AsyncStorage.getItem(
          storageKey
        );

      if (!data) {
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify([])
        );

        return [];
      }

      return JSON.parse(data) as Task[];
    } catch (error) {
      console.error(
        "Error al obtener tareas:",
        error
      );

      return [];
    }
  },

  async createTask(
    task: Omit<Task, "id">
  ): Promise<Task> {
    const tasks = await this.getTasks();

    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      notificationId: undefined,
    };

    tasks.unshift(newTask);

    await saveTasks(tasks);

    return newTask;
  },

  async updateTask(
    id: string,
    updatedFields: Partial<Task>
  ): Promise<Task | undefined> {
    const tasks = await this.getTasks();

    const currentTask = tasks.find(
      (task) => task.id === id
    );

    if (!currentTask) {
      return undefined;
    }

    const updatedTask: Task = {
      ...currentTask,
      ...updatedFields,
      id: currentTask.id,
    };

    const updatedTasks = tasks.map(
      (task) =>
        task.id === id
          ? updatedTask
          : task
    );

    await saveTasks(updatedTasks);

    return updatedTask;
  },

  async deleteTask(
    id: string
  ): Promise<void> {
    const tasks = await this.getTasks();

    const updatedTasks = tasks.filter(
      (task) => task.id !== id
    );

    await saveTasks(updatedTasks);
  },

  async getTaskById(
    id: string
  ): Promise<Task | undefined> {
    const tasks = await this.getTasks();

    return tasks.find(
      (task) => task.id === id
    );
  },

  async getDashboard() {
    const tasks = await this.getTasks();

    return {
      totalTasks: tasks.length,

      completedTasks: tasks.filter(
        (task) => task.completed
      ).length,

      pendingTasks: tasks.filter(
        (task) => !task.completed
      ).length,

      recentTasks: tasks.slice(0, 5),
    };
  },
};