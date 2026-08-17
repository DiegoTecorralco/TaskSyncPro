import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";

const TOKEN_KEY = "@tasksync_token";
const SESSION_KEY = "@tasksync_session";

interface BackendUser {
  usuario_id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: BackendUser;
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

export const authService = {
  async login(
    correo: string,
    password: string
  ): Promise<LoginResponse> {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      }
    );

    const data: LoginResponse =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "No se pudo iniciar sesión."
      );
    }

    if (
      data.success &&
      data.data?.token &&
      data.data.user
    ) {
      await AsyncStorage.setItem(
        TOKEN_KEY,
        data.data.token
      );

      await AsyncStorage.setItem(
        SESSION_KEY,
        JSON.stringify(data.data.user)
      );
    }

    return data;
  },

  async register({
    nombre,
    apellido_paterno,
    apellido_materno,
    correo,
    password,
  }: {
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    correo: string;
    password: string;
  }): Promise<RegisterResponse> {
    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido_paterno,
          apellido_materno,
          correo,
          password,
        }),
      }
    );

    const data: RegisterResponse =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "No se pudo registrar el usuario."
      );
    }

    return data;
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      TOKEN_KEY,
      SESSION_KEY,
    ]);
  },
};