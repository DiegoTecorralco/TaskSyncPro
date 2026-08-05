import { View, Text, StyleSheet } from "react-native";

interface Props {
  name: string;
  color: string;
}

export default function CategoryCard({
  name,
  color,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor: color,
        },
      ]}
    >
      <Text style={styles.text}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 8,
  },

  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});