import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";
import { Category } from "../types";

const TOKEN_KEY = "@tasksync_token";

interface BackendCategory {
  categoria_id: number;
  nombre: string;
}

interface BackendResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

async function getHeaders() {
  const token = await getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

function backendCategoryToCategory(
  category: BackendCategory
): Category {
  return {
    id: String(category.categoria_id),
    name: category.nombre,
    color: "#4F46E5",
  };
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const headers = await getHeaders();

      const response = await fetch(
        `${API_URL}/categories`,
        {
          method: "GET",
          headers,
        }
      );

      const result: BackendResponse<
        BackendCategory[]
      > = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "No se pudieron obtener las categorías."
        );
      }

      const categories = result.data || [];

      return categories.map(
        backendCategoryToCategory
      );
    } catch (error) {
      console.error(
        "Error al obtener categorías:",
        error
      );

      return [];
    }
  },

  async createCategory(
    category: Omit<Category, "id">
  ): Promise<Category> {
    const headers = await getHeaders();

    const response = await fetch(
      `${API_URL}/categories`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          nombre: category.name,
        }),
      }
    );

    const result: BackendResponse<{
      categoria_id: number;
    }> = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "No se pudo crear la categoría."
      );
    }

    if (!result.data) {
      throw new Error(
        "El servidor no devolvió el ID de la categoría."
      );
    }

    return {
      ...category,
      id: String(result.data.categoria_id),
    };
  },

  async updateCategory(
    id: string,
    category: Partial<Category>
  ): Promise<Category | undefined> {
    const current =
      await this.getCategoryById(id);

    if (!current) {
      return undefined;
    }

    const updatedCategory: Category = {
      ...current,
      ...category,
      id: current.id,
    };

    const headers = await getHeaders();

    const response = await fetch(
      `${API_URL}/categories/${id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          nombre: updatedCategory.name,
        }),
      }
    );

    const result: BackendResponse<null> =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "No se pudo actualizar la categoría."
      );
    }

    return updatedCategory;
  },

  async deleteCategory(
    id: string
  ): Promise<boolean> {
    const headers = await getHeaders();

    const response = await fetch(
      `${API_URL}/categories/${id}`,
      {
        method: "DELETE",
        headers,
      }
    );

    const result: BackendResponse<null> =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "No se pudo eliminar la categoría."
      );
    }

    return true;
  },

  async getCategoryById(
    id: string
  ): Promise<Category | undefined> {
    try {
      const headers = await getHeaders();

      const response = await fetch(
        `${API_URL}/categories/${id}`,
        {
          method: "GET",
          headers,
        }
      );

      if (response.status === 404) {
        return undefined;
      }

      const result: BackendResponse<
        BackendCategory
      > = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "No se pudo obtener la categoría."
        );
      }

      if (!result.data) {
        return undefined;
      }

      return backendCategoryToCategory(
        result.data
      );
    } catch (error) {
      console.error(
        "Error al obtener categoría:",
        error
      );

      return undefined;
    }
  },
};