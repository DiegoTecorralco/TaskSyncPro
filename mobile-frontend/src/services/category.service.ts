import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category } from "../types";

const STORAGE_KEY = "@categories";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (!data) {
      const defaults: Category[] = [
        {
          id: "1",
          name: "Trabajo",
          color: "#4F46E5",
        },
        {
          id: "2",
          name: "Escuela",
          color: "#22C55E",
        },
        {
          id: "3",
          name: "Personal",
          color: "#F97316",
        },
      ];

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaults)
      );

      return defaults;
    }

    return JSON.parse(data);
  },

  async createCategory(category: Omit<Category, "id">) {
    const categories = await this.getCategories();

    const newCategory: Category = {
      id: Date.now().toString(),
      ...category,
    };

    categories.push(newCategory);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(categories)
    );

    return newCategory;
  },

  async deleteCategory(id: string) {
    const categories = await this.getCategories();

    const updated = categories.filter(
      (c) => c.id !== id
    );

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    return true;
  },
};