import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import { categoryService } from "../../services/category.service";
import { Category } from "../../types";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);

  async function loadCategories() {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error(
        "Error al cargar categorías:",
        error
      );
    }
  }

  useFocusEffect(
    useCallback(() => {
      void loadCategories();
    }, [])
  );

  function editCategory(category: Category) {
    router.push({
      pathname: "/category/edit",
      params: {
        id: category.id,
      },
    });
  }

  function confirmDelete(category: Category) {
    Alert.alert(
      "Eliminar categoría",
      `¿Deseas eliminar "${category.name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await categoryService.deleteCategory(
                category.id
              );

              await loadCategories();
            } catch (error) {
              console.error(
                "Error al eliminar categoría:",
                error
              );

              Alert.alert(
                "Error",
                "No se pudo eliminar la categoría."
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Categorías
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          categories.length === 0
            ? styles.emptyList
            : undefined
        }
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            <View
              style={[
                styles.colorIndicator,
                {
                  backgroundColor: item.color,
                },
              ]}
            />

            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>
                {item.name}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                editCategory(item)
              }
            >
              <Text style={styles.editButtonText}>
                ✏️
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                confirmDelete(item)
              }
            >
              <Text style={styles.deleteButtonText}>
                🗑️
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay categorías registradas.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push("/category/create")
        }
      >
        <Text style={styles.buttonText}>
          + Nueva categoría
        </Text>
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
    color: "#111827",
  },

  categoryCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  colorIndicator: {
    width: 12,
    height: 42,
    borderRadius: 6,
    marginRight: 14,
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  editButton: {
    padding: 10,
    marginRight: 4,
  },

  editButtonText: {
    fontSize: 20,
  },

  deleteButton: {
    padding: 10,
  },

  deleteButtonText: {
    fontSize: 20,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
  },

  button: {
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});