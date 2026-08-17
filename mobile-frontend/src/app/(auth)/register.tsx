import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";

import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  const {
    register,
    isAuthenticated,
    loading,
  } = useAuth();

  const [nombre, setNombre] =
    useState("");

  const [
    apellidoPaterno,
    setApellidoPaterno,
  ] = useState("");

  const [
    apellidoMaterno,
    setApellidoMaterno,
  ] = useState("");

  const [correo, setCorreo] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  function showMessage(
    title: string,
    message: string
  ) {
    if (Platform.OS === "web") {
      window.alert(
        `${title}\n\n${message}`
      );

      return;
    }

    Alert.alert(
      title,
      message
    );
  }

  async function handleRegister() {
    const cleanNombre =
      nombre.trim();

    const cleanApellidoPaterno =
      apellidoPaterno.trim();

    const cleanApellidoMaterno =
      apellidoMaterno.trim();

    const cleanCorreo =
      correo
        .trim()
        .toLowerCase();

    if (
      !cleanNombre ||
      !cleanApellidoPaterno ||
      !cleanApellidoMaterno ||
      !cleanCorreo ||
      !password ||
      !confirmPassword
    ) {
      showMessage(
        "Datos incompletos",
        "Completa todos los campos."
      );

      return;
    }

    if (
      !cleanCorreo.includes("@")
    ) {
      showMessage(
        "Correo incorrecto",
        "Escribe un correo electrónico válido."
      );

      return;
    }

    if (
      password.length < 6
    ) {
      showMessage(
        "Contraseña corta",
        "La contraseña debe tener al menos 6 caracteres."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      showMessage(
        "Contraseñas diferentes",
        "Las contraseñas no coinciden."
      );

      return;
    }

    try {
      setSaving(true);

      const success =
        await register({
          nombre:
            cleanNombre,

          apellido_paterno:
            cleanApellidoPaterno,

          apellido_materno:
            cleanApellidoMaterno,

          correo:
            cleanCorreo,

          password,
        });

      if (!success) {
        showMessage(
          "No se pudo crear la cuenta",
          "El correo ya está registrado o el servidor rechazó el registro."
        );

        return;
      }

      showMessage(
        "Cuenta creada",
        "Tu cuenta fue registrada correctamente. Ahora inicia sesión."
      );

      router.replace(
        "/(auth)/login"
      );
    } catch (error) {
      console.error(
        "Error al crear la cuenta:",
        error
      );

      showMessage(
        "Error",
        "No fue posible conectar con el servidor."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <Redirect
        href="/(tabs)/dashboard"
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={
        styles.keyboardContainer
      }
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.logo}>
          <Ionicons
            name="person-add-outline"
            size={42}
            color="#FFF"
          />
        </View>

        <Text style={styles.title}>
          Crear cuenta
        </Text>

        <Text
          style={styles.subtitle}
        >
          Regístrate para comenzar
          a organizar tus tareas.
        </Text>

        <Text style={styles.label}>
          Nombre
        </Text>

        <View
          style={
            styles.inputContainer
          }
        >
          <Ionicons
            name="person-outline"
            size={21}
            color="#6B7280"
          />

          <TextInput
            value={nombre}
            onChangeText={
              setNombre
            }
            placeholder="Nombre"
            autoCapitalize="words"
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>
          Apellido paterno
        </Text>

        <View
          style={
            styles.inputContainer
          }
        >
          <Ionicons
            name="person-outline"
            size={21}
            color="#6B7280"
          />

          <TextInput
            value={
              apellidoPaterno
            }
            onChangeText={
              setApellidoPaterno
            }
            placeholder="Apellido paterno"
            autoCapitalize="words"
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>
          Apellido materno
        </Text>

        <View
          style={
            styles.inputContainer
          }
        >
          <Ionicons
            name="person-outline"
            size={21}
            color="#6B7280"
          />

          <TextInput
            value={
              apellidoMaterno
            }
            onChangeText={
              setApellidoMaterno
            }
            placeholder="Apellido materno"
            autoCapitalize="words"
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>
          Correo electrónico
        </Text>

        <View
          style={
            styles.inputContainer
          }
        >
          <Ionicons
            name="mail-outline"
            size={21}
            color="#6B7280"
          />

          <TextInput
            value={correo}
            onChangeText={
              setCorreo
            }
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>
          Contraseña
        </Text>

        <View
          style={
            styles.inputContainer
          }
        >
          <Ionicons
            name="lock-closed-outline"
            size={21}
            color="#6B7280"
          />

          <TextInput
            value={password}
            onChangeText={
              setPassword
            }
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={
              !showPassword
            }
            autoCapitalize="none"
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() =>
              setShowPassword(
                (current) =>
                  !current
              )
            }
          >
            <Ionicons
              name={
                showPassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={22}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>
          Confirmar contraseña
        </Text>

        <View
          style={
            styles.inputContainer
          }
        >
          <Ionicons
            name="lock-closed-outline"
            size={21}
            color="#6B7280"
          />

          <TextInput
            value={
              confirmPassword
            }
            onChangeText={
              setConfirmPassword
            }
            placeholder="Repite la contraseña"
            secureTextEntry={
              !showConfirmPassword
            }
            autoCapitalize="none"
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() =>
              setShowConfirmPassword(
                (current) =>
                  !current
              )
            }
          >
            <Ionicons
              name={
                showConfirmPassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={22}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.registerButton,
            saving &&
              styles.disabledButton,
          ]}
          onPress={
            handleRegister
          }
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              color="#FFF"
            />
          ) : (
            <Text
              style={
                styles.registerButtonText
              }
            >
              Crear cuenta
            </Text>
          )}
        </TouchableOpacity>

        <View
          style={
            styles.loginRow
          }
        >
          <Text
            style={
              styles.loginText
            }
          >
            ¿Ya tienes una cuenta?
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.replace(
                "/(auth)/login"
              )
            }
          >
            <Text
              style={
                styles.loginLink
              }
            >
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    keyboardContainer: {
      flex: 1,
      backgroundColor:
        "#F5F7FB",
    },

    container: {
      flexGrow: 1,
      justifyContent:
        "center",
      padding: 24,
      paddingBottom: 40,
    },

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#F5F7FB",
    },

    logo: {
      width: 82,
      height: 82,
      borderRadius: 25,
      alignSelf: "center",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#4F46E5",
      marginBottom: 22,
    },

    title: {
      color: "#111827",
      fontSize: 31,
      fontWeight: "bold",
      textAlign: "center",
    },

    subtitle: {
      color: "#6B7280",
      fontSize: 16,
      lineHeight: 23,
      textAlign: "center",
      marginTop: 8,
      marginBottom: 28,
    },

    label: {
      color: "#374151",
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 7,
    },

    inputContainer: {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF",
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderRadius: 14,
      paddingHorizontal: 14,
      marginBottom: 16,
    },

    input: {
      flex: 1,
      color: "#111827",
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 14,
    },

    registerButton: {
      minHeight: 56,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#4F46E5",
      borderRadius: 14,
      marginTop: 10,
    },

    registerButtonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },

    disabledButton: {
      opacity: 0.65,
    },

    loginRow: {
      flexDirection: "row",
      justifyContent:
        "center",
      flexWrap: "wrap",
      marginTop: 24,
    },

    loginText: {
      color: "#6B7280",
      fontSize: 15,
    },

    loginLink: {
      color: "#4F46E5",
      fontSize: 15,
      fontWeight: "bold",
      marginLeft: 5,
    },
  });