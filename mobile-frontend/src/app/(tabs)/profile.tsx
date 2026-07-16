import {
  View,
  Text,
 StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>

      <View style={styles.avatar}>
        <Ionicons
          name="person"
          size={70}
          color="#FFF"
        />
      </View>

      <Text style={styles.name}>
        Carlos Isaac
      </Text>

      <Text style={styles.email}>
        carlos@email.com
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Total de tareas
        </Text>

        <Text style={styles.cardValue}>
          18
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Completadas
        </Text>

        <Text style={styles.cardValue}>
          10
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Pendientes
        </Text>

        <Text style={styles.cardValue}>
          8
        </Text>
      </View>

      <TouchableOpacity style={styles.logout}>
        <Text style={styles.logoutText}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    alignItems: "center",
    padding: 25,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },

  email: {
    color: "#666",
    marginBottom: 30,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontWeight: "600",
    fontSize: 17,
  },

  cardValue: {
    fontWeight: "bold",
    color: "#4F46E5",
    fontSize: 17,
  },

  logout: {
    marginTop: 40,
    backgroundColor: "#EF4444",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },

  logoutText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});