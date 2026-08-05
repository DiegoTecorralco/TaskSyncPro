import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Task } from "../../types";
import { taskService } from "../../services/task.service";

interface Props {
  task: Task;
  reload: () => void | Promise<void>;
}

function formatDueDate(date: string) {
  if (!date) {
    return {
      text: "Sin fecha",
      expired: false,
    };
  }

  const [year, month, day] = date.split("-").map(Number);

  const dueDate = new Date(year, month - 1, day);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (Number.isNaN(dueDate.getTime())) {
    return {
      text: "Fecha inválida",
      expired: false,
    };
  }

  if (dueDate < today) {
    return {
      text: "⚠ Vencida",
      expired: true,
    };
  }

  const formatted = dueDate.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    text: `📅 ${formatted}`,
    expired: false,
  };
}

export default function TaskCard({ task, reload }: Props) {
  const dueDate = formatDueDate(task.dueDate);

  async function toggleTask() {
    try {
      await taskService.updateTask(task.id, {
        completed: !task.completed,
      });

      await reload();
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);

      Alert.alert(
        "Error",
        "No se pudo actualizar la tarea."
      );
    }
  }

  function editTask() {
    router.push({
      pathname: "/task/edit",
      params: {
        id: task.id,
      },
    });
  }

  async function confirmDelete() {
    try {
      await taskService.deleteTask(task.id);
      await reload();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);

      if (Platform.OS === "web") {
        window.alert("No se pudo eliminar la tarea.");
      } else {
        Alert.alert(
          "Error",
          "No se pudo eliminar la tarea."
        );
      }
    }
  }

  function deleteTask() {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "¿Estás seguro de eliminar esta tarea?"
      );

      if (confirmed) {
        void confirmDelete();
      }

      return;
    }

    Alert.alert(
      "Eliminar tarea",
      "¿Estás seguro de eliminar esta tarea?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            void confirmDelete();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.check}
        onPress={toggleTask}
      >
        <Ionicons
          name={
            task.completed
              ? "checkmark-circle"
              : "ellipse-outline"
          }
          size={28}
          color={
            task.completed
              ? "#22C55E"
              : "#999"
          }
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            task.completed && styles.completed,
          ]}
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text style={styles.description}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.infoRow}>
          <View
            style={[
              styles.priorityBadge,
              task.priority === "Alta"
                ? styles.priorityHigh
                : task.priority === "Media"
                  ? styles.priorityMedium
                  : styles.priorityLow,
            ]}
          >
            <Text style={styles.priorityText}>
              {task.priority}
            </Text>
          </View>

          <Text
            style={[
              styles.date,
              dueDate.expired && styles.expiredDate,
            ]}
          >
            {dueDate.text}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={editTask}
        >
          <Ionicons
            name="create-outline"
            size={24}
            color="#4F46E5"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={deleteTask}
        >
          <Ionicons
            name="trash-outline"
            size={24}
            color="#EF4444"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },

  check: {
    marginRight: 15,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },

  completed: {
    textDecorationLine: "line-through",
    color: "#999",
  },

  description: {
    marginTop: 6,
    color: "#666",
    fontSize: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  priorityText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },

  priorityHigh: {
    backgroundColor: "#EF4444",
  },

  priorityMedium: {
    backgroundColor: "#F59E0B",
  },

  priorityLow: {
    backgroundColor: "#22C55E",
  },

  date: {
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
  },

  expiredDate: {
    color: "#EF4444",
    fontWeight: "bold",
  },

  actions: {
    justifyContent: "space-between",
    marginLeft: 15,
  },

  iconButton: {
    paddingVertical: 8,
  },
});