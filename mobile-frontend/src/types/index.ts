// ============================
// Categorías
// ============================

export interface Category {
  id: string;
  name: string;
  color: string;
}

// ============================
// Recordatorios
// ============================

export type ReminderOption =
  | 0
  | 10
  | 30
  | 60
  | 1440;

// ============================
// Tareas
// ============================

export interface Task {
  id: string;

  title: string;

  description: string;

  categoryId: string;

  completed: boolean;

  createdAt: string;

  // Formato: YYYY-MM-DD
  dueDate: string;

  // Formato: HH:mm
  dueTime?: string;

  priority: "Alta" | "Media" | "Baja";

  reminderEnabled?: boolean;

  reminderMinutesBefore?: ReminderOption;

  notificationId?: string;
}

// ============================
// Dashboard
// ============================

export interface DashboardData {
  totalTasks: number;

  completedTasks: number;

  pendingTasks: number;

  recentTasks: Task[];
}

// ============================
// Usuario
// ============================

export interface User {
  id: string;

  name: string;

  email: string;

  password: string;

  avatar?: string;
}