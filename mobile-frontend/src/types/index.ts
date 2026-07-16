// ============================
// Categorías
// ============================

export interface Category {
  id: string;
  name: string;
  color: string;
}

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

  dueDate: string;

  priority: "Alta" | "Media" | "Baja";
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