import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
} from "expo-router";

import { useAuth } from "../../context/AuthContext";
import { taskService } from "../../services/task.service";

import { Task } from "../../types";

export default function ProfileScreen() {
  const {
    user,
    updateProfile,
    logout,
  } = useAuth();

  const [tasks, setTasks] = useState<Task[]>(
    []
  );

  const [name, setName] = useState(
    user?.name ?? ""
  );

  const [email, setEmail] = useState(
    user?.email ?? ""
  );

  const [editing, setEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      setName(user?.name ?? "");
      setEmail(user?.email ?? "");

      void loadTasks();
    }, [user])
  );

  async function loadTasks() {
    try {
      setLoading(true);

      const taskList =
        await taskService.getTasks();

      setTasks(taskList);
    } catch (error) {
      console.error(
        "Error al cargar las tareas:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function showMessage(
    title: string,
    message: string
  ) {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    Alert.alert(title, message);
  }

  async function handleSaveProfile() {
    if (!name.trim()) {
      showMessage(
        "Datos incompletos",
        "El nombre es obligatorio."
      );

      return;
    }

    if (!email.trim()) {
      showMessage(
        "Datos incompletos",
        "El correo es obligatorio."
      );

      return;
    }

    if (!email.includes("@")) {
      showMessage(
        "Correo incorrecto",
        "Escribe un correo electrónico válido."
      );

      return;
    }

    try {
      setSaving(true);

      const success =
        await updateProfile({
          name,
          email,
        });

      if (!success) {
        showMessage(
          "No se pudo actualizar",
          "El correo ya está registrado o ocurrió un error."
        );

        return;
      }

      setEditing(false);

      showMessage(
        "Perfil actualizado",
        "Los datos se guardaron correctamente."
      );
    } finally {
      setSaving(false);
    }
  }

  async function executeLogout() {
    await logout();

    router.replace("/(auth)/login");
  }

  function handleLogout() {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "¿Quieres cerrar tu sesión?"
      );

      if (confirmed) {
        void executeLogout();
      }

      return;
    }

    Alert.alert(
      "Cerrar sesión",
      "¿Quieres cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            void executeLogout();
          },
        },
      ]
    );
  }

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const userInitials = getInitials(
    user?.name ?? "Usuario"
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text style={styles.loadingText}>
          Cargando perfil...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.screenTitle}>
        Mi perfil
      </Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userInitials}
          </Text>
        </View>

        <Text style={styles.userName}>
          {user?.name ?? "Usuario"}
        </Text>

        <Text style={styles.userEmail}>
          {user?.email ??
            "Sin correo registrado"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Resumen de tareas
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View
            style={[
              styles.statIcon,
              styles.totalIcon,
            ]}
          >
            <Ionicons
              name="list-outline"
              size={24}
              color="#4F46E5"
            />
          </View>

          <Text style={styles.statValue}>
            {totalTasks}
          </Text>

          <Text style={styles.statLabel}>
            Total
          </Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[
              styles.statIcon,
              styles.pendingIcon,
            ]}
          >
            <Ionicons
              name="time-outline"
              size={24}
              color="#D97706"
            />
          </View>

          <Text style={styles.statValue}>
            {pendingTasks}
          </Text>

          <Text style={styles.statLabel}>
            Pendientes
          </Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[
              styles.statIcon,
              styles.completedIcon,
            ]}
          >
            <Ionicons
              name="checkmark-outline"
              size={24}
              color="#16A34A"
            />
          </View>

          <Text style={styles.statValue}>
            {completedTasks}
          </Text>

          <Text style={styles.statLabel}>
            Completadas
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Información personal
        </Text>

        {!editing && (
          <TouchableOpacity
            onPress={() =>
              setEditing(true)
            }
          >
            <Text style={styles.editText}>
              Editar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.formCard}>
        <Text style={styles.inputLabel}>
          Nombre
        </Text>

        <View
          style={[
            styles.inputContainer,
            !editing &&
              styles.disabledInput,
          ]}
        >
          <Ionicons
            name="person-outline"
            size={21}
            color="#6B7280"
          />

          <TextInput
            value={name}
            onChangeText={setName}
            editable={editing}
            placeholder="Nombre"
            style={styles.input}
          />
        </View>

        <Text style={styles.inputLabel}>
          Correo electrónico
        </Text>

        <View
          style={[
            styles.inputContainer,
            !editing &&
              styles.disabledInput,
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={21}
            color="#6B7280"
          />

          <TextInput
            value={email}
            onChangeText={setEmail}
            editable={editing}
            placeholder="correo@ejemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        {editing && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setName(user?.name ?? "");
                setEmail(
                  user?.email ?? ""
                );
                setEditing(false);
              }}
              disabled={saving}
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                saving &&
                  styles.disabledButton,
              ]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              <Text
                style={styles.saveButtonText}
              >
                {saving
                  ? "Guardando..."
                  : "Guardar"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color="#DC2626"
        />

        <Text style={styles.logoutText}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function getInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "U";
  }

  if (words.length === 1) {
    return words[0]
      .substring(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 45,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
  },

  loadingText: {
    color: "#6B7280",
    fontSize: 16,
    marginTop: 12,
  },

  screenTitle: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
    marginBottom: 14,
  },

  avatarText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  userName: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "bold",
  },

  userEmail: {
    color: "#6B7280",
    fontSize: 15,
    marginTop: 5,
  },

  sectionTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  editText: {
    color: "#4F46E5",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 14,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  totalIcon: {
    backgroundColor: "#EEF2FF",
  },

  pendingIcon: {
    backgroundColor: "#FEF3C7",
  },

  completedIcon: {
    backgroundColor: "#DCFCE7",
  },

  statValue: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
  },

  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  inputLabel: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 7,
  },

  inputContainer: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  disabledInput: {
    backgroundColor: "#F9FAFB",
  },

  input: {
    flex: 1,
    color: "#111827",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  cancelButtonText: {
    color: "#374151",
    fontWeight: "bold",
  },

  saveButton: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#4F46E5",
  },

  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.6,
  },

  logoutButton: {
    minHeight: 56,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    marginTop: 25,
  },

  logoutText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 9,
  },
});