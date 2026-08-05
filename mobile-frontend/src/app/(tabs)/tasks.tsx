import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import { Task } from "../../types";
import { taskService } from "../../services/task.service";
import TaskCard from "../../components/task/TaskCard";

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function loadTasks() {
    const data = await taskService.getTasks();
    setTasks(data);
  }

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis tareas</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            reload={loadTasks}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No hay tareas registradas.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/task/create")}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 16,
  },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  plus: {
    fontSize: 36,
    color: "#FFF",
  },
});