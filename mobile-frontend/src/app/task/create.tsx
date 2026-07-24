import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { categoryService } from "../../services/category.service";
import { taskService } from "../../services/task.service";

import {
  Category,
  ReminderOption,
} from "../../types";

interface ReminderItem {
  label: string;
  value: ReminderOption;
}

const REMINDER_OPTIONS: ReminderItem[] = [
  {
    label: "Al momento del vencimiento",
    value: 0,
  },
  {
    label: "10 minutos antes",
    value: 10,
  },
  {
    label: "30 minutos antes",
    value: 30,
  },
  {
    label: "1 hora antes",
    value: 60,
  },
  {
    label: "1 día antes",
    value: 1440,
  },
];

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [priority, setPriority] = useState<
    "Alta" | "Media" | "Baja"
  >("Media");

  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("09:00");

  const [
    reminderEnabled,
    setReminderEnabled,
  ] = useState(false);

  const [
    reminderMinutesBefore,
    setReminderMinutesBefore,
  ] = useState<ReminderOption>(10);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data =
        await categoryService.getCategories();

      setCategories(data);

      if (data.length > 0) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error(
        "Error al cargar categorías:",
        error
      );

      showMessage(
        "Error",
        "No se pudieron cargar las categorías."
      );
    }
  }

  function showMessage(
    titleMessage: string,
    message: string
  ) {
    if (Platform.OS === "web") {
      window.alert(`${titleMessage}\n\n${message}`);
      return;
    }

    Alert.alert(titleMessage, message);
  }

  function isValidDate(date: string): boolean {
    const pattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!pattern.test(date)) {
      return false;
    }

    const [year, month, day] = date
      .split("-")
      .map(Number);

    const parsedDate = new Date(
      year,
      month - 1,
      day
    );

    return (
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day
    );
  }

  function isValidTime(time: string): boolean {
    const pattern =
      /^([01]\d|2[0-3]):([0-5]\d)$/;

    return pattern.test(time);
  }

  function getReminderDate(): Date | null {
    if (!isValidDate(dueDate)) {
      return null;
    }

    if (!isValidTime(dueTime)) {
      return null;
    }

    const [year, month, day] = dueDate
      .split("-")
      .map(Number);

    const [hour, minute] = dueTime
      .split(":")
      .map(Number);

    const reminderDate = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      0,
      0
    );

    reminderDate.setMinutes(
      reminderDate.getMinutes() -
        reminderMinutesBefore
    );

    return reminderDate;
  }

  function validateForm(): boolean {
    if (!title.trim()) {
      showMessage(
        "Datos incompletos",
        "El título es obligatorio."
      );

      return false;
    }

    if (!selectedCategory) {
      showMessage(
        "Datos incompletos",
        "Selecciona una categoría."
      );

      return false;
    }

    if (dueDate && !isValidDate(dueDate)) {
      showMessage(
        "Fecha incorrecta",
        "Escribe la fecha con el formato YYYY-MM-DD. Por ejemplo: 2026-07-30."
      );

      return false;
    }

    if (
      reminderEnabled &&
      !dueDate
    ) {
      showMessage(
        "Fecha necesaria",
        "Debes indicar una fecha de vencimiento para activar el recordatorio."
      );

      return false;
    }

    if (
      reminderEnabled &&
      !isValidTime(dueTime)
    ) {
      showMessage(
        "Hora incorrecta",
        "Escribe la hora con el formato HH:mm. Por ejemplo: 14:30."
      );

      return false;
    }

    if (reminderEnabled) {
      const reminderDate = getReminderDate();

      if (
        !reminderDate ||
        reminderDate.getTime() <= Date.now()
      ) {
        showMessage(
          "Recordatorio inválido",
          "La fecha y hora del recordatorio deben estar en el futuro."
        );

        return false;
      }
    }

    return true;
  }

  async function handleSave() {
    if (!validateForm() || saving) {
      return;
    }

    try {
      setSaving(true);

      await taskService.createTask({
        title: title.trim(),
        description: description.trim(),
        categoryId: selectedCategory,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate,
        dueTime:
          dueDate || reminderEnabled
            ? dueTime
            : undefined,
        priority,
        reminderEnabled,
        reminderMinutesBefore:
          reminderEnabled
            ? reminderMinutesBefore
            : undefined,
      });

      showMessage(
        "Tarea guardada",
        reminderEnabled
          ? "La tarea y su recordatorio se guardaron correctamente."
          : "La tarea se guardó correctamente."
      );

      router.back();
    } catch (error) {
      console.error(
        "Error al guardar la tarea:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar la tarea.";

      showMessage("Error", message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        Nueva tarea
      </Text>

      <Text style={styles.fieldLabel}>
        Título
      </Text>

      <TextInput
        placeholder="Ejemplo: Entregar proyecto"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        maxLength={100}
      />

      <Text style={styles.fieldLabel}>
        Descripción
      </Text>

      <TextInput
        placeholder="Describe los detalles de la tarea"
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
        style={[
          styles.input,
          styles.descriptionInput,
        ]}
        maxLength={500}
      />

      <Text style={styles.label}>
        Categoría
      </Text>

      {categories.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            No hay categorías disponibles.
          </Text>
        </View>
      ) : (
        categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.option,
              selectedCategory ===
                category.id &&
                styles.selectedOption,
            ]}
            onPress={() =>
              setSelectedCategory(
                category.id
              )
            }
          >
            <View
              style={[
                styles.color,
                {
                  backgroundColor:
                    category.color,
                },
              ]}
            />

            <Text style={styles.optionText}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.label}>
        Prioridad
      </Text>

      <View style={styles.priorityRow}>
        {(
          [
            "Alta",
            "Media",
            "Baja",
          ] as const
        ).map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.priorityOption,
              priority === item &&
                styles.selectedOption,
            ]}
            onPress={() =>
              setPriority(item)
            }
          >
            <View
              style={[
                styles.priorityDot,
                item === "Alta"
                  ? styles.highDot
                  : item === "Media"
                    ? styles.mediumDot
                    : styles.lowDot,
              ]}
            />

            <Text style={styles.optionText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>
        Fecha de vencimiento
      </Text>

      <TextInput
        placeholder="2026-07-30"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
        autoCapitalize="none"
        keyboardType={
          Platform.OS === "ios"
            ? "numbers-and-punctuation"
            : "default"
        }
        maxLength={10}
      />

      <Text style={styles.helpText}>
        Formato requerido: YYYY-MM-DD
      </Text>

      <Text style={styles.label}>
        Hora de vencimiento
      </Text>

      <TextInput
        placeholder="09:00"
        value={dueTime}
        onChangeText={setDueTime}
        style={styles.input}
        autoCapitalize="none"
        keyboardType={
          Platform.OS === "ios"
            ? "numbers-and-punctuation"
            : "default"
        }
        maxLength={5}
      />

      <Text style={styles.helpText}>
        Usa el formato de 24 horas: HH:mm
      </Text>

      <View style={styles.reminderCard}>
        <View style={styles.reminderHeader}>
          <View style={styles.reminderTextContainer}>
            <Text style={styles.reminderTitle}>
              Activar recordatorio
            </Text>

            <Text style={styles.reminderDescription}>
              Recibe una notificación antes de
              que venza la tarea.
            </Text>
          </View>

          <Switch
            value={reminderEnabled}
            onValueChange={
              setReminderEnabled
            }
            trackColor={{
              false: "#CBD5E1",
              true: "#A5B4FC",
            }}
            thumbColor={
              reminderEnabled
                ? "#4F46E5"
                : "#F8FAFC"
            }
          />
        </View>

        {reminderEnabled && (
          <View style={styles.reminderOptions}>
            <Text style={styles.label}>
              Notificarme
            </Text>

            {REMINDER_OPTIONS.map(
              (option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    reminderMinutesBefore ===
                      option.value &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    setReminderMinutesBefore(
                      option.value
                    )
                  }
                >
                  <View
                    style={[
                      styles.radioOuter,
                      reminderMinutesBefore ===
                        option.value &&
                        styles.radioOuterSelected,
                    ]}
                  >
                    {reminderMinutesBefore ===
                      option.value && (
                      <View
                        style={
                          styles.radioInner
                        }
                      />
                    )}
                  </View>

                  <Text
                    style={styles.optionText}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        )}
      </View>

      {Platform.OS === "web" &&
        reminderEnabled && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Las tareas se guardan en web,
              pero los recordatorios locales
              deben probarse en Android o iOS.
            </Text>
          </View>
        )}

      <TouchableOpacity
        style={[
          styles.button,
          saving && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving
            ? "Guardando..."
            : "Guardar tarea"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 25,
  },

  fieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  label: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 15,
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#FFF",
    color: "#111827",
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  descriptionInput: {
    height: 110,
  },

  helpText: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 8,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  selectedOption: {
    borderColor: "#4F46E5",
    borderWidth: 2,
    backgroundColor: "#EEF2FF",
  },

  optionText: {
    fontSize: 16,
    color: "#1F2937",
  },

  color: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
  },

  priorityRow: {
    flexDirection: "row",
    gap: 10,
  },

  priorityOption: {
    flex: 1,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 7,
  },

  highDot: {
    backgroundColor: "#EF4444",
  },

  mediumDot: {
    backgroundColor: "#F59E0B",
  },

  lowDot: {
    backgroundColor: "#22C55E",
  },

  reminderCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  reminderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  reminderTextContainer: {
    flex: 1,
    paddingRight: 15,
  },

  reminderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  reminderDescription: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },

  reminderOptions: {
    marginTop: 10,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  radioOuterSelected: {
    borderColor: "#4F46E5",
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4F46E5",
  },

  warningBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 14,
    marginTop: 15,
  },

  warningText: {
    color: "#92400E",
    fontSize: 14,
    lineHeight: 20,
  },

  emptyBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  emptyText: {
    color: "#6B7280",
    textAlign: "center",
  },

  button: {
    backgroundColor: "#4F46E5",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});