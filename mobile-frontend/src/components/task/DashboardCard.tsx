import { View, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  value: string | number;
}

export default function DashboardCard({
  title,
  value,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    margin: 8,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 4,
  },

  value: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4F46E5",
  },

  title: {
    marginTop: 8,
    color: "#666",
    fontSize: 16,
  },
});