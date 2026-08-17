import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Link,
  Redirect,
  router,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const {
    login,
    isAuthenticated,
    loading,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [signingIn, setSigningIn] =
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

    Alert.alert(title, message);
  }

  async function handleLogin() {
    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      showMessage(
        "Datos incompletos",
        "Ingresa tu correo y contraseña."
      );

      return;
    }

    if (!cleanEmail.includes("@")) {
      showMessage(
        "Correo incorrecto",
        "Escribe un correo electrónico válido."
      );

      return;
    }

    if (signingIn) {
      return;
    }

    try {
      setSigningIn(true);

      const success =
        await login(
          cleanEmail,
          password
        );

      if (!success) {
        showMessage(
          "No se pudo iniciar sesión",
          "Verifica tu correo, contraseña y que el servidor esté disponible."
        );

        return;
      }

      router.replace(
        "/(tabs)/dashboard"
      );
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error
      );

      showMessage(
        "Error de conexión",
        "No fue posible conectar con el backend."
      );
    } finally {
      setSigningIn(false);
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
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Ionicons
          name="checkmark-done-outline"
          size={42}
          color="#FFF"
        />
      </View>

      <Text style={styles.logo}>
        TaskSync Pro
      </Text>

      <Text style={styles.subtitle}>
        Inicia sesión para continuar
      </Text>

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
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
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
          placeholder="Contraseña"
          secureTextEntry={
            !showPassword
          }
          autoCapitalize="none"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
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

      <TouchableOpacity
        style={[
          styles.button,
          signingIn &&
            styles.disabledButton,
        ]}
        onPress={handleLogin}
        disabled={signingIn}
      >
        {signingIn ? (
          <ActivityIndicator
            color="#FFF"
          />
        ) : (
          <Text
            style={
              styles.buttonText
            }
          >
            Iniciar sesión
          </Text>
        )}
      </TouchableOpacity>

      <Link
        href="/(auth)/register"
        style={styles.link}
      >
        ¿No tienes cuenta? Crear cuenta
      </Link>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 25,
      backgroundColor:
        "#F5F7FB",
    },

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "#F5F7FB",
    },

    logoCircle: {
      width: 82,
      height: 82,
      borderRadius: 25,
      alignSelf: "center",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#4F46E5",
      marginBottom: 18,
    },

    logo: {
      fontSize: 34,
      fontWeight: "bold",
      color: "#4F46E5",
      textAlign: "center",
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 18,
      color: "#666",
      textAlign: "center",
      marginBottom: 35,
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
      backgroundColor:
        "#FFF",
      borderWidth: 1,
      borderColor:
        "#D1D5DB",
      borderRadius: 14,
      paddingHorizontal: 14,
      marginBottom: 18,
    },

    input: {
      flex: 1,
      color: "#111827",
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 14,
    },

    button: {
      minHeight: 56,
      backgroundColor:
        "#4F46E5",
      borderRadius: 14,
      alignItems: "center",
      justifyContent:
        "center",
      marginTop: 10,
    },

    disabledButton: {
      opacity: 0.65,
    },

    buttonText: {
      color: "#FFF",
      fontSize: 17,
      fontWeight: "bold",
    },

    link: {
      textAlign: "center",
      marginTop: 25,
      color: "#4F46E5",
      fontWeight: "600",
    },
  });