import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const success = await login(email, password);

    if (success) {
      router.replace("/(tabs)/dashboard");
    } else {
      Alert.alert(
        "Error",
        "Correo o contraseña incorrectos."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        TaskSync Pro
      </Text>

      <Text style={styles.subtitle}>
        Inicia sesión
      </Text>

      <TextInput
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Iniciar sesión
        </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F5F7FB",
  },

  logo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#4F46E5",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 35,
  },

  input: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  button: {
    backgroundColor: "#4F46E5",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
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