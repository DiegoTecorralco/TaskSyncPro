import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { API_URL } from "../config/api";
import { authService } from "../services/auth.service";
import { User } from "../types";

interface RegisterData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  password: string;
}

interface AuthContextType {
  user: User | null;

  isAuthenticated: boolean;

  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  register: (
    data: RegisterData
  ) => Promise<boolean>;

  updateProfile: (
    data: Partial<User>
  ) => Promise<boolean>;

  logout: () => Promise<void>;
}

const SESSION_KEY = "@tasksync_session";
const TOKEN_KEY = "@tasksync_token";

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    void restoreSession();
  }, []);

  async function restoreSession() {
    try {
      setLoading(true);

      const [session, token] =
        await Promise.all([
          AsyncStorage.getItem(
            SESSION_KEY
          ),

          AsyncStorage.getItem(
            TOKEN_KEY
          ),
        ]);

      if (!session || !token) {
        setUser(null);
        return;
      }

      const storedUser =
        JSON.parse(session);

      const sessionUser: User = {
        id:
          storedUser.id?.toString() ??
          storedUser.usuario_id?.toString(),

        name:
          storedUser.name ??
          buildFullName(
            storedUser.nombre,
            storedUser.apellido_paterno,
            storedUser.apellido_materno
          ),

        email:
          storedUser.email ??
          storedUser.correo,

        avatar:
          storedUser.avatar,
      };

      if (
        !sessionUser.id ||
        !sessionUser.email
      ) {
        await clearSession();
        return;
      }

      setUser(sessionUser);
    } catch (error) {
      console.error(
        "Error al restaurar la sesión:",
        error
      );

      await clearSession();
    } finally {
      setLoading(false);
    }
  }

  async function login(
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const normalizedEmail =
        email.trim().toLowerCase();

      const response =
        await authService.login(
          normalizedEmail,
          password
        );

      if (
        !response.success ||
        !response.data
      ) {
        return false;
      }

      const backendUser =
        response.data.user;

      const sessionUser: User = {
        id:
          backendUser.usuario_id.toString(),

        name: buildFullName(
          backendUser.nombre,
          backendUser.apellido_paterno,
          backendUser.apellido_materno
        ),

        email:
          backendUser.correo,

        avatar: undefined,
      };

      await AsyncStorage.setItem(
        SESSION_KEY,
        JSON.stringify(
          sessionUser
        )
      );

      setUser(sessionUser);

      return true;
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error
      );

      return false;
    }
  }

  async function register(
    data: RegisterData
  ): Promise<boolean> {
    try {
      const response =
        await authService.register({
          nombre:
            data.nombre.trim(),

          apellido_paterno:
            data.apellido_paterno.trim(),

          apellido_materno:
            data.apellido_materno.trim(),

          correo:
            data.correo
              .trim()
              .toLowerCase(),

          password:
            data.password,
        });

      return response.success;
    } catch (error) {
      console.error(
        "Error al registrar usuario:",
        error
      );

      return false;
    }
  }

  async function updateProfile(
    data: Partial<User>
  ): Promise<boolean> {
    if (!user) {
      return false;
    }

    try {
      const token =
        await AsyncStorage.getItem(
          TOKEN_KEY
        );

      const fullName =
        data.name?.trim() ||
        user.name;

      const nameParts = fullName
        .split(/\s+/)
        .filter(Boolean);

      const nombre =
        nameParts[0] || "";

      const apellido_paterno =
        nameParts[1] || "";

      const apellido_materno =
        nameParts
          .slice(2)
          .join(" ");

      const correo =
        data.email
          ?.trim()
          .toLowerCase() ||
        user.email;

      const response = await fetch(
        `${API_URL}/users/${user.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        console.error(
          "Error del backend al actualizar perfil:",
          result
        );

        return false;
      }

      const updatedUser: User = {
        ...user,

        name: fullName,

        email: correo,
      };

      await AsyncStorage.setItem(
        SESSION_KEY,
        JSON.stringify(
          updatedUser
        )
      );

      setUser(updatedUser);

      return true;
    } catch (error) {
      console.error(
        "Error al actualizar el perfil:",
        error
      );

      return false;
    }
  }

  async function logout() {
    try {
      await authService.logout();

      setUser(null);
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error
      );

      setUser(null);
    }
  }

  async function clearSession() {
    await AsyncStorage.multiRemove([
      SESSION_KEY,
      TOKEN_KEY,
    ]);

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,

        isAuthenticated:
          Boolean(user),

        loading,

        login,

        register,

        updateProfile,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function buildFullName(
  nombre?: string,
  apellidoPaterno?: string,
  apellidoMaterno?: string
): string {
  return [
    nombre,
    apellidoPaterno,
    apellidoMaterno,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider."
    );
  }

  return context;
}