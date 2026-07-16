import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types";

const STORAGE_KEY = "@tasks";

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (!data) {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([])
        );

        return [];
      }

      return JSON.parse(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      return [];
    }
  },

  async createTask(task: Omit<Task, "id">): Promise<Task> {
    const tasks = await this.getTasks();

    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
    };

    tasks.unshift(newTask);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );

    return newTask;
  },

  async updateTask(
    id: string,
    updatedFields: Partial<Task>
  ): Promise<void> {
    const tasks = await this.getTasks();

    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, ...updatedFields }
        : task
    );

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedTasks)
    );
  },

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getTasks();

    const updatedTasks = tasks.filter(
      (task) => task.id !== id
    );

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedTasks)
    );
  },

  async getTaskById(id: string): Promise<Task | undefined> {
    const tasks = await this.getTasks();

    return tasks.find((task) => task.id === id);
  },

  async getDashboard() {
    const tasks = await this.getTasks();

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.completed).length,
      pendingTasks: tasks.filter((t) => !t.completed).length,
      recentTasks: tasks.slice(0, 5),
    };
  },
};