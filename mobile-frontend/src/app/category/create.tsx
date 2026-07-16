import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";
import { categoryService } from "../../services/category.service";

export default function CreateCategory() {

  const [name, setName] = useState("");

  async function handleSave() {

    if (!name.trim()) return;

    await categoryService.createCategory({
      name,
      color: "#4F46E5",
    });

    router.back();
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Nueva Categoría
      </Text>

      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          Guardar
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    padding:25,
    backgroundColor:"#F5F7FB"
  },

  title:{
    fontSize:28,
    fontWeight:"bold",
    marginBottom:30
  },

  input:{
    backgroundColor:"#FFF",
    padding:16,
    borderRadius:12,
    marginBottom:20
  },

  button:{
    backgroundColor:"#4F46E5",
    padding:18,
    borderRadius:12,
    alignItems:"center"
  },

  buttonText:{
    color:"#FFF",
    fontWeight:"bold",
    fontSize:18
  }

});