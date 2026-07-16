import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";

import { Calendar, DateData } from "react-native-calendars";

import { taskService } from "../../services/task.service";
import { Task } from "../../types";

export default function CalendarScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await taskService.getTasks();
    setTasks(data);
  }

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    tasks.forEach((task) => {
      if (task.dueDate) {
        marks[task.dueDate] = {
          marked: true,
          dotColor: "#4F46E5",
        };
      }
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: "#4F46E5",
    };

    return marks;
  }, [tasks, selectedDate]);

  const filteredTasks = tasks.filter(
    (task) => task.dueDate === selectedDate
  );

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        📅 Calendario
      </Text>

      <Calendar
        markedDates={markedDates}
        onDayPress={(day: DateData) =>
          setSelectedDate(day.dateString)
        }
        theme={{
          todayTextColor: "#4F46E5",
          selectedDayBackgroundColor: "#4F46E5",
          arrowColor: "#4F46E5",
          dotColor: "#4F46E5",
        }}
      />

      <Text style={styles.subtitle}>
        Tareas del día
      </Text>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No hay tareas para esta fecha.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text style={styles.taskTitle}>
              {item.title}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>

            <View style={styles.footer}>

              <Text
                style={[
                  styles.priority,

                  item.priority === "Alta"
                    ? styles.high

                    : item.priority === "Media"
                    ? styles.medium

                    : styles.low,
                ]}
              >
                {item.priority}
              </Text>

              <Text style={styles.date}>
                {item.dueDate}
              </Text>

            </View>

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
  },

  empty: {
    textAlign: "center",
    marginTop: 25,
    color: "#999",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  description: {
    color: "#666",
    marginTop: 6,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  priority: {
    color: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: "bold",
    overflow: "hidden",
  },

  high: {
    backgroundColor: "#EF4444",
  },

  medium: {
    backgroundColor: "#F59E0B",
  },

  low: {
    backgroundColor: "#22C55E",
  },

  date: {
    color: "#666",
    fontWeight: "600",
  },

});