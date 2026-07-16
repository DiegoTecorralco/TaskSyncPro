import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Task } from "../../types";
import { taskService } from "../../services/task.service";

interface Props {
  task: Task;
  reload: () => void;
}

/* ===========================
   Formatear fecha
=========================== */

function formatDueDate(date: string) {
  if (!date) {
    return {
      text: "Sin fecha",
      expired: false,
    };
  }

  const dueDate = new Date(date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

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

export default function TaskCard({
  task,
  reload,
}: Props) {

  const dueDate = formatDueDate(task.dueDate);

  async function toggleTask() {
    await taskService.updateTask(task.id, {
      completed: !task.completed,
    });

    reload();
  }

  function editTask() {
    router.push({
      pathname: "/task/edit",
      params: {
        id: task.id,
      },
    });
  }

  function deleteTask() {
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
          onPress: async () => {
            await taskService.deleteTask(task.id);
            reload();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.card}>

      {/* Botón completar */}

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

      {/* Información */}

      <View style={styles.content}>

        <Text
          style={[
            styles.title,
            task.completed &&
              styles.completed,
          ]}
        >
          {task.title}
        </Text>

        <Text style={styles.description}>
          {task.description}
        </Text>

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
              dueDate.expired &&
                styles.expiredDate,
            ]}
          >
            {dueDate.text}
          </Text>

        </View>

      </View>

      {/* Acciones */}

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

  /* Badge prioridad */

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

  /* Fecha */

  date: {
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
  },

  expiredDate: {
    color: "#EF4444",
    fontWeight: "bold",
  },

  /* Acciones */

  actions: {
    justifyContent: "space-between",
    marginLeft: 15,
  },

  iconButton: {
    paddingVertical: 8,
  },

});