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

import { router } from "expo-router";

import { categoryService } from "../../services/category.service";
import { taskService } from "../../services/task.service";

import { Category } from "../../types";

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [priority, setPriority] = useState<
    "Alta" | "Media" | "Baja"
  >("Media");

  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await categoryService.getCategories();

    setCategories(data);

    if (data.length > 0) {
      setSelectedCategory(data[0].id);
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert(
        "Error",
        "El título es obligatorio."
      );
      return;
    }

    if (!selectedCategory) {
      Alert.alert(
        "Error",
        "Selecciona una categoría."
      );
      return;
    }

    await taskService.createTask({
      title,
      description,
      categoryId: selectedCategory,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
      priority,
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
        Nueva tarea
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
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          Guardar tarea
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