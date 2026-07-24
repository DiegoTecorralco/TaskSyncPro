import AsyncStorage from "@react-native-async-storage/async-storage";

import { Task } from "../types";
import { notificationService } from "./notification.service";

const STORAGE_KEY = "@tasks";

async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks)
  );
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const data =
        await AsyncStorage.getItem(STORAGE_KEY);

      if (!data) {
        await saveTasks([]);

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

    const taskId = Date.now().toString();

    let notificationId: string | undefined;

    if (
      task.reminderEnabled &&
      task.dueDate &&
      task.dueTime &&
      task.reminderMinutesBefore !== undefined
    ) {
      notificationId =
        await notificationService.scheduleTaskReminder({
          taskId,
          title: task.title,
          dueDate: task.dueDate,
          dueTime: task.dueTime,
          minutesBefore:
            task.reminderMinutesBefore,
        });
    }

    const newTask: Task = {
      id: taskId,
      ...task,
      notificationId,
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

    await notificationService.cancelNotification(
      currentTask.notificationId
    );

    const mergedTask: Task = {
      ...currentTask,
      ...updatedFields,
      notificationId: undefined,
    };

    let notificationId: string | undefined;

    if (
      mergedTask.reminderEnabled &&
      !mergedTask.completed &&
      mergedTask.dueDate &&
      mergedTask.dueTime &&
      mergedTask.reminderMinutesBefore !== undefined
    ) {
      notificationId =
        await notificationService.scheduleTaskReminder({
          taskId: mergedTask.id,
          title: mergedTask.title,
          dueDate: mergedTask.dueDate,
          dueTime: mergedTask.dueTime,
          minutesBefore:
            mergedTask.reminderMinutesBefore,
        });
    }

    const finalTask: Task = {
      ...mergedTask,
      notificationId,
    };

    const updatedTasks = tasks.map((task) =>
      task.id === id ? finalTask : task
    );

    await saveTasks(updatedTasks);

    return finalTask;
  },

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getTasks();

    const taskToDelete = tasks.find(
      (task) => task.id === id
    );

    await notificationService.cancelNotification(
      taskToDelete?.notificationId
    );

    const updatedTasks = tasks.filter(
      (task) => task.id !== id
    );

    await saveTasks(updatedTasks);
  },

  async getTaskById(
    id: string
  ): Promise<Task | undefined> {
    const tasks = await this.getTasks();

    return tasks.find((task) => task.id === id);
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