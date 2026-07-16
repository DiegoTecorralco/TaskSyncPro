import { useEffect, useState } from "react";
import {
  View,
 Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { taskService } from "../../services/task.service";
import { categoryService } from "../../services/category.service";

import { Task, Category } from "../../types";

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [priority, setPriority] = useState<
    "Alta" | "Media" | "Baja"
  >("Media");

  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const categoryList = await categoryService.getCategories();
    setCategories(categoryList);

    if (!id) return;

    const task = await taskService.getTaskById(id);

    if (!task) {
      Alert.alert("Error", "La tarea no existe.");
      router.back();
      return;
    }

    setTitle(task.title);
    setDescription(task.description);
    setSelectedCategory(task.categoryId);
    setPriority(task.priority);
    setDueDate(task.dueDate);
  }

  async function handleUpdate() {
    if (!id) return;

    if (!title.trim()) {
      Alert.alert(
        "Error",
        "El título es obligatorio."
      );
      return;
    }

    await taskService.updateTask(id, {
      title,
      description,
      categoryId: selectedCategory,
      priority,
      dueDate,
    });

    router.back();
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
    >
      <Text style={styles.title}>
        Editar tarea
      </Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, { height: 100 }]}
      />

      <Text style={styles.label}>
        Categoría
      </Text>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.option,
            selectedCategory === category.id &&
              styles.selectedOption,
          ]}
          onPress={() =>
            setSelectedCategory(category.id)
          }
        >
          <View
            style={[
              styles.color,
              {
                backgroundColor: category.color,
              },
            ]}
          />

          <Text style={styles.optionText}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>
        Prioridad
      </Text>

      {(["Alta", "Media", "Baja"] as const).map(
        (item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.option,
              priority === item &&
                styles.selectedOption,
            ]}
            onPress={() =>
              setPriority(item)
            }
          >
            <Text style={styles.optionText}>
              {item}
            </Text>
          </TouchableOpacity>
        )
      )}

      <Text style={styles.label}>
        Fecha de vencimiento
      </Text>

      <TextInput
        placeholder="2026-07-30"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
      >
        <Text style={styles.buttonText}>
          Guardar cambios
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 25,
  },

  label: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  selectedOption: {
    borderColor: "#4F46E5",
    borderWidth: 2,
  },

  optionText: {
    fontSize: 16,
  },

  color: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
  },

  button: {
    backgroundColor: "#4F46E5",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});