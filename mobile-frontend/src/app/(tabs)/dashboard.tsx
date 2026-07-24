import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
} from "expo-router";

import DashboardCard from "../../components/task/DashboardCard";

import { taskService } from "../../services/task.service";
import { categoryService } from "../../services/category.service";

import { Task } from "../../types";

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categoryCount, setCategoryCount] =
    useState(0);

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      void loadDashboard();
    }, [])
  );

  async function loadDashboard() {
    try {
      setLoading(true);

      const [taskList, categoryList] =
        await Promise.all([
          taskService.getTasks(),
          categoryService.getCategories(),
        ]);

      setTasks(taskList);
      setCategoryCount(categoryList.length);
    } catch (error) {
      console.error(
        "Error al cargar el dashboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const today = new Date();
  const todayString = formatDateKey(today);

  const todayTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate === todayString
  );

  const highPriorityTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.priority === "Alta"
  );

  const pendingTaskList = [...tasks]
    .filter((task) => !task.completed)
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) {
        return 0;
      }

      if (!a.dueDate) {
        return 1;
      }

      if (!b.dueDate) {
        return -1;
      }

      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 5);

  function openTasks() {
    router.push("/(tabs)/tasks");
  }

  function openTask(taskId: string) {
    router.push({
      pathname: "/task/edit",
      params: {
        id: taskId,
      },
    });
  }

  function createTask() {
    router.push("/task/create");
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text style={styles.loadingText}>
          Cargando tus tareas...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            👋 Bienvenido
          </Text>

          <Text style={styles.subtitle}>
            TaskSync Pro
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={createTask}
        >
          <Ionicons
            name="add"
            size={28}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.cardWrapper}>
          <DashboardCard
            title="Total"
            value={totalTasks}
          />
        </View>

        <View style={styles.cardWrapper}>
          <DashboardCard
            title="Pendientes"
            value={pendingTasks}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.cardWrapper}>
          <DashboardCard
            title="Completadas"
            value={completedTasks}
          />
        </View>

        <View style={styles.cardWrapper}>
          <DashboardCard
            title="Categorías"
            value={categoryCount}
          />
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <View
            style={[
              styles.summaryIcon,
              styles.todayIcon,
            ]}
          >
            <Ionicons
              name="today-outline"
              size={24}
              color="#2563EB"
            />
          </View>

          <View>
            <Text style={styles.summaryValue}>
              {todayTasks.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Para hoy
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View
            style={[
              styles.summaryIcon,
              styles.priorityIcon,
            ]}
          >
            <Ionicons
              name="flame-outline"
              size={24}
              color="#DC2626"
            />
          </View>

          <View>
            <Text style={styles.summaryValue}>
              {highPriorityTasks.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Prioridad alta
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.section}>
          Próximas tareas
        </Text>

        {pendingTasks > 0 && (
          <TouchableOpacity onPress={openTasks}>
            <Text style={styles.viewAll}>
              Ver todas
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {pendingTaskList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="checkmark-done-circle-outline"
            size={64}
            color="#22C55E"
          />

          <Text style={styles.emptyTitle}>
            No tienes tareas pendientes
          </Text>

          <Text style={styles.emptyDescription}>
            Crea una nueva tarea para comenzar.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={createTask}
          >
            <Text style={styles.emptyButtonText}>
              Crear tarea
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        pendingTaskList.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.task}
            onPress={() =>
              openTask(task.id)
            }
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.priorityLine,
                task.priority === "Alta"
                  ? styles.highLine
                  : task.priority === "Media"
                    ? styles.mediumLine
                    : styles.lowLine,
              ]}
            />

            <View style={styles.taskContent}>
              <View style={styles.taskTopRow}>
                <Text
                  style={styles.taskTitle}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>

                <View
                  style={[
                    styles.priorityBadge,
                    task.priority === "Alta"
                      ? styles.highBadge
                      : task.priority === "Media"
                        ? styles.mediumBadge
                        : styles.lowBadge,
                  ]}
                >
                  <Text
                    style={
                      styles.priorityText
                    }
                  >
                    {task.priority}
                  </Text>
                </View>
              </View>

              {task.description ? (
                <Text
                  style={styles.taskDescription}
                  numberOfLines={2}
                >
                  {task.description}
                </Text>
              ) : null}

              <View style={styles.taskFooter}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={
                    isExpired(task.dueDate)
                      ? "#EF4444"
                      : "#6B7280"
                  }
                />

                <Text
                  style={[
                    styles.taskDate,
                    isExpired(task.dueDate) &&
                      styles.expiredDate,
                  ]}
                >
                  {formatDueDate(
                    task.dueDate,
                    task.dueTime
                  )}
                </Text>

                {task.reminderEnabled && (
                  <Ionicons
                    name="notifications-outline"
                    size={16}
                    color="#4F46E5"
                    style={styles.reminderIcon}
                  />
                )}
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(date.getDate()).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
}

function parseLocalDate(date: string): Date | null {
  if (!date) {
    return null;
  }

  const [year, month, day] = date
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function isExpired(date: string): boolean {
  const dueDate = parseLocalDate(date);

  if (!dueDate) {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
}

function formatDueDate(
  date: string,
  time?: string
): string {
  const parsedDate = parseLocalDate(date);

  if (!parsedDate) {
    return "Sin fecha";
  }

  const today = new Date();
  const tomorrow = new Date();

  today.setHours(0, 0, 0, 0);

  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  parsedDate.setHours(0, 0, 0, 0);

  let dateText = parsedDate.toLocaleDateString(
    "es-MX",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  if (
    parsedDate.getTime() === today.getTime()
  ) {
    dateText = "Hoy";
  } else if (
    parsedDate.getTime() ===
    tomorrow.getTime()
  ) {
    dateText = "Mañana";
  } else if (parsedDate < today) {
    dateText = "Vencida";
  }

  return time
    ? `${dateText} · ${time}`
    : dateText;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitle: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 18,
  },

  addButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    marginHorizontal: -5,
  },

  cardWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },

  summaryRow: {
    flexDirection: "row",
    marginHorizontal: -5,
    marginTop: 10,
  },

  summaryCard: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  summaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  todayIcon: {
    backgroundColor: "#DBEAFE",
  },

  priorityIcon: {
    backgroundColor: "#FEE2E2",
  },

  summaryValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },

  summaryLabel: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 2,
  },

  sectionHeader: {
    marginTop: 28,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  section: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },

  viewAll: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 15,
  },

  task: {
    minHeight: 110,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  priorityLine: {
    width: 5,
    alignSelf: "stretch",
    borderRadius: 5,
    marginRight: 14,
  },

  highLine: {
    backgroundColor: "#EF4444",
  },

  mediumLine: {
    backgroundColor: "#F59E0B",
  },

  lowLine: {
    backgroundColor: "#22C55E",
  },

  taskContent: {
    flex: 1,
  },

  taskTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  taskTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginRight: 10,
  },

  taskDescription: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },

  taskFooter: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  taskDate: {
    marginLeft: 6,
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "500",
  },

  expiredDate: {
    color: "#EF4444",
    fontWeight: "bold",
  },

  reminderIcon: {
    marginLeft: 10,
  },

  priorityBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },

  highBadge: {
    backgroundColor: "#FEE2E2",
  },

  mediumBadge: {
    backgroundColor: "#FEF3C7",
  },

  lowBadge: {
    backgroundColor: "#DCFCE7",
  },

  priorityText: {
    color: "#374151",
    fontSize: 11,
    fontWeight: "bold",
  },

  emptyContainer: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 12,
  },

  emptyDescription: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    fontSize: 14,
  },

  emptyButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 18,
  },

  emptyButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});