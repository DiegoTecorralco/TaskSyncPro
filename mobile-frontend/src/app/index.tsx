import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Redirect } from "expo-router";

import { useAuth } from "../context/AuthContext";

export default function IndexScreen() {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text style={styles.text}>
          Iniciando TaskSync Pro...
        </Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <Redirect href="/(tabs)/dashboard" />
    );
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
  },

  text: {
    color: "#6B7280",
    fontSize: 16,
    marginTop: 12,
  },
});