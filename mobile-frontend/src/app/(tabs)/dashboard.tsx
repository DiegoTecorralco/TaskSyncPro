import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import DashboardCard from "../../components/task/DashboardCard";

export default function DashboardScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
    >
      <Text style={styles.title}>
        👋 Bienvenido
      </Text>

      <Text style={styles.subtitle}>
        TaskSync Pro
      </Text>

      <View style={styles.row}>
        <DashboardCard
          title="Total"
          value={12}
        />

        <DashboardCard
          title="Pendientes"
          value={5}
        />
      </View>

      <View style={styles.row}>
        <DashboardCard
          title="Completadas"
          value={7}
        />

        <DashboardCard
          title="Categorías"
          value={4}
        />
      </View>

      <Text style={styles.section}>
        Últimas tareas
      </Text>

      <View style={styles.task}>
        <Text>📝 Proyecto React Native</Text>
      </View>

      <View style={styles.task}>
        <Text>📝 Diseño UI</Text>
      </View>

      <View style={styles.task}>
        <Text>📝 Base de Datos</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#666",
    marginBottom: 20,
    fontSize: 18,
  },

  row: {
    flexDirection: "row",
  },

  section: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 22,
    fontWeight: "bold",
  },

  task: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
});