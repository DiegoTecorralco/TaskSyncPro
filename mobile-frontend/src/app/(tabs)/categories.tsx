import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import CategoryCard from "../../components/category/CategoryCard";
import { categoryService } from "../../services/category.service";
import { Category } from "../../types";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);

  async function loadCategories() {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryCard
            name={item.name}
            color={item.color}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay categorías registradas.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/category/create")}
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
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
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