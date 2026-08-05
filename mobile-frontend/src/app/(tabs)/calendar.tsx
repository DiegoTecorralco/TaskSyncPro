import { useCallback, useMemo, useState } from "react";

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFocusEffect } from "expo-router";

import {
  Calendar,
  DateData,
  LocaleConfig,
  WeekCalendar,
} from "react-native-calendars";

import { taskService } from "../../services/task.service";
import { Task } from "../../types";

LocaleConfig.locales.es = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],

  monthNamesShort: [
    "Ene.",
    "Feb.",
    "Mar.",
    "Abr.",
    "May.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dic.",
  ],

  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],

  dayNamesShort: [
    "Dom.",
    "Lun.",
    "Mar.",
    "Mié.",
    "Jue.",
    "Vie.",
    "Sáb.",
  ],

  today: "Hoy",
};

LocaleConfig.defaultLocale = "es";

type CalendarView = "month" | "week";

const COLORS = {
  primary: "#4F46E5",
  completed: "#22C55E",
  pending: "#F59E0B",
  overdue: "#EF4444",
  background: "#F5F7FB",
  white: "#FFFFFF",
  text: "#111827",
  secondaryText: "#6B7280",
  border: "#E5E7EB",
};

export default function CalendarScreen() {
  const today = getLocalDateString();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarView, setCalendarView] =
    useState<CalendarView>("month");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  async function loadTasks() {
    try {
      setLoading(true);

      const data = await taskService.getTasks();

      setTasks(data);
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
    } finally {
      setLoading(false);
    }
  }

  function getTaskStatus(task: Task) {
    if (task.completed) {
      return "completed";
    }

    if (task.dueDate && task.dueDate < today) {
      return "overdue";
    }

    return "pending";
  }

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    tasks.forEach((task) => {
      if (!task.dueDate) {
        return;
      }

      const status = getTaskStatus(task);

      if (!marks[task.dueDate]) {
        marks[task.dueDate] = {
          dots: [],
        };
      }

      const currentDots = marks[task.dueDate].dots;

      const dotExists = currentDots.some(
        (dot: { key: string }) => dot.key === status
      );

      if (!dotExists) {
        currentDots.push({
          key: status,
          color:
            status === "completed"
              ? COLORS.completed
              : status === "overdue"
              ? COLORS.overdue
              : COLORS.pending,
        });
      }
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: COLORS.primary,
      selectedTextColor: COLORS.white,
      dots: marks[selectedDate]?.dots || [],
    };

    return marks;
  }, [tasks, selectedDate, today]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => task.dueDate === selectedDate)
      .sort((firstTask, secondTask) => {
        const statusOrder = {
          overdue: 0,
          pending: 1,
          completed: 2,
        };

        const firstStatus = getTaskStatus(firstTask);
        const secondStatus = getTaskStatus(secondTask);

        return (
          statusOrder[firstStatus] -
          statusOrder[secondStatus]
        );
      });
  }, [tasks, selectedDate, today]);

  const selectedDayStats = useMemo(() => {
    const completed = filteredTasks.filter(
      (task) => getTaskStatus(task) === "completed"
    ).length;

    const pending = filteredTasks.filter(
      (task) => getTaskStatus(task) === "pending"
    ).length;

    const overdue = filteredTasks.filter(
      (task) => getTaskStatus(task) === "overdue"
    ).length;

    return {
      total: filteredTasks.length,
      completed,
      pending,
      overdue,
    };
  }, [filteredTasks, today]);

  function handleDayPress(day: DateData) {
    setSelectedDate(day.dateString);
  }

  function renderTask({ item }: { item: Task }) {
    const status = getTaskStatus(item);

    return (
      <View style={styles.taskCard}>
        <View
          style={[
            styles.statusLine,
            status === "completed"
              ? styles.completedBackground
              : status === "overdue"
              ? styles.overdueBackground
              : styles.pendingBackground,
          ]}
        />

        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <Text
              style={[
                styles.taskTitle,
                item.completed && styles.completedTaskTitle,
              ]}
            >
              {item.title}
            </Text>

            <View
              style={[
                styles.statusBadge,
                status === "completed"
                  ? styles.completedBackground
                  : status === "overdue"
                  ? styles.overdueBackground
                  : styles.pendingBackground,
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {status === "completed"
                  ? "Completada"
                  : status === "overdue"
                  ? "Vencida"
                  : "Pendiente"}
              </Text>
            </View>
          </View>

          {item.description ? (
            <Text style={styles.description}>
              {item.description}
            </Text>
          ) : null}

          <View style={styles.taskFooter}>
            <View
              style={[
                styles.priorityBadge,
                item.priority === "Alta"
                  ? styles.highPriority
                  : item.priority === "Media"
                  ? styles.mediumPriority
                  : styles.lowPriority,
              ]}
            >
              <Text style={styles.priorityText}>
                {item.priority}
              </Text>
            </View>

            <Text style={styles.date}>
              📅 {formatDate(item.dueDate)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Calendario</Text>

                <Text style={styles.headerSubtitle}>
                  Organiza y consulta tus tareas
                </Text>
              </View>

              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>📅</Text>
              </View>
            </View>

            <View style={styles.viewSelector}>
              <Pressable
                style={[
                  styles.viewButton,
                  calendarView === "month" &&
                    styles.activeViewButton,
                ]}
                onPress={() => setCalendarView("month")}
              >
                <Text
                  style={[
                    styles.viewButtonText,
                    calendarView === "month" &&
                      styles.activeViewButtonText,
                  ]}
                >
                  Mensual
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.viewButton,
                  calendarView === "week" &&
                    styles.activeViewButton,
                ]}
                onPress={() => setCalendarView("week")}
              >
                <Text
                  style={[
                    styles.viewButtonText,
                    calendarView === "week" &&
                      styles.activeViewButtonText,
                  ]}
                >
                  Semanal
                </Text>
              </Pressable>
            </View>

            <View style={styles.calendarContainer}>
              {calendarView === "month" ? (
                <Calendar
                  current={selectedDate}
                  markingType="multi-dot"
                  markedDates={markedDates}
                  onDayPress={handleDayPress}
                  enableSwipeMonths
                  firstDay={1}
                  theme={calendarTheme}
                />
              ) : (
                <WeekCalendar
                  current={selectedDate}
                  markingType="multi-dot"
                  markedDates={markedDates}
                  onDayPress={handleDayPress}
                  firstDay={1}
                  allowShadow={false}
                  theme={calendarTheme}
                />
              )}
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    styles.completedBackground,
                  ]}
                />

                <Text style={styles.legendText}>
                  Completadas
                </Text>
              </View>

              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    styles.pendingBackground,
                  ]}
                />

                <Text style={styles.legendText}>
                  Pendientes
                </Text>
              </View>

              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    styles.overdueBackground,
                  ]}
                />

                <Text style={styles.legendText}>
                  Vencidas
                </Text>
              </View>
            </View>

            <View style={styles.selectedDateHeader}>
              <View>
                <Text style={styles.selectedDateTitle}>
                  {formatSelectedDate(selectedDate)}
                </Text>

                <Text style={styles.selectedDateSubtitle}>
                  {selectedDayStats.total === 1
                    ? "1 tarea programada"
                    : `${selectedDayStats.total} tareas programadas`}
                </Text>
              </View>

              <View style={styles.totalCounter}>
                <Text style={styles.totalCounterNumber}>
                  {selectedDayStats.total}
                </Text>

                <Text style={styles.totalCounterText}>
                  Total
                </Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text
                  style={[
                    styles.statNumber,
                    styles.completedText,
                  ]}
                >
                  {selectedDayStats.completed}
                </Text>

                <Text style={styles.statLabel}>
                  Completadas
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text
                  style={[
                    styles.statNumber,
                    styles.pendingText,
                  ]}
                >
                  {selectedDayStats.pending}
                </Text>

                <Text style={styles.statLabel}>
                  Pendientes
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text
                  style={[
                    styles.statNumber,
                    styles.overdueText,
                  ]}
                >
                  {selectedDayStats.overdue}
                </Text>

                <Text style={styles.statLabel}>
                  Vencidas
                </Text>
              </View>
            </View>

            <Text style={styles.tasksTitle}>
              Tareas del día
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {loading ? "⏳" : "🗓️"}
            </Text>

            <Text style={styles.emptyTitle}>
              {loading
                ? "Cargando tareas..."
                : "No hay tareas"}
            </Text>

            {!loading && (
              <Text style={styles.emptyText}>
                No tienes tareas programadas para esta fecha.
              </Text>
            )}
          </View>
        }
      />
    </View>
  );
}

function getLocalDateString() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0"
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString: string) {
  if (!dateString) {
    return "Sin fecha";
  }

  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSelectedDate(dateString: string) {
  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day);

  const formattedDate = date.toLocaleDateString(
    "es-MX",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  );

  return (
    formattedDate.charAt(0).toUpperCase() +
    formattedDate.slice(1)
  );
}

const calendarTheme = {
  backgroundColor: COLORS.white,
  calendarBackground: COLORS.white,
  textSectionTitleColor: COLORS.secondaryText,
  selectedDayBackgroundColor: COLORS.primary,
  selectedDayTextColor: COLORS.white,
  todayTextColor: COLORS.primary,
  dayTextColor: COLORS.text,
  textDisabledColor: "#D1D5DB",
  dotColor: COLORS.primary,
  selectedDotColor: COLORS.white,
  arrowColor: COLORS.primary,
  monthTextColor: COLORS.text,
  textMonthFontWeight: "700" as const,
  textDayFontWeight: "500" as const,
  textDayHeaderFontWeight: "600" as const,
  textMonthFontSize: 18,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.secondaryText,
  },

  todayBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  todayBadgeText: {
    fontSize: 24,
  },

  viewSelector: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },

  viewButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: "center",
  },

  activeViewButton: {
    backgroundColor: COLORS.white,
  },

  viewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },

  activeViewButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  calendarContainer: {
    overflow: "hidden",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 15,
    gap: 16,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },

  selectedDateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 14,
  },

  selectedDateTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  selectedDateSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.secondaryText,
  },

  totalCounter: {
    minWidth: 62,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
  },

  totalCounterNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },

  totalCounterText: {
    fontSize: 11,
    color: COLORS.primary,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "800",
  },

  statLabel: {
    marginTop: 3,
    fontSize: 11,
    color: COLORS.secondaryText,
  },

  completedText: {
    color: COLORS.completed,
  },

  pendingText: {
    color: COLORS.pending,
  },

  overdueText: {
    color: COLORS.overdue,
  },

  tasksTitle: {
    marginBottom: 14,
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  taskCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 13,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  statusLine: {
    width: 6,
  },

  taskContent: {
    flex: 1,
    padding: 16,
  },

  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  taskTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  completedTaskTitle: {
    color: COLORS.secondaryText,
    textDecorationLine: "line-through",
  },

  description: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.secondaryText,
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
  },

  taskFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },

  priorityBadge: {
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },

  priorityText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.white,
  },

  highPriority: {
    backgroundColor: COLORS.overdue,
  },

  mediumPriority: {
    backgroundColor: COLORS.pending,
  },

  lowPriority: {
    backgroundColor: COLORS.completed,
  },

  date: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },

  completedBackground: {
    backgroundColor: COLORS.completed,
  },

  pendingBackground: {
    backgroundColor: COLORS.pending,
  },

  overdueBackground: {
    backgroundColor: COLORS.overdue,
  },

  emptyContainer: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: COLORS.secondaryText,
  },
});