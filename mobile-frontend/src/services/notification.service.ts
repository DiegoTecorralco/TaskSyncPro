import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

import { ReminderOption } from "../types";

const CHANNEL_ID = "task-reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function createNotificationDate(
  dueDate: string,
  dueTime: string,
  minutesBefore: number
): Date | null {
  if (!dueDate || !dueTime) {
    return null;
  }

  const dateParts = dueDate.split("-").map(Number);
  const timeParts = dueTime.split(":").map(Number);

  if (
    dateParts.length !== 3 ||
    timeParts.length !== 2
  ) {
    return null;
  }

  const [year, month, day] = dateParts;
  const [hours, minutes] = timeParts;

  const notificationDate = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    0,
    0
  );

  notificationDate.setMinutes(
    notificationDate.getMinutes() - minutesBefore
  );

  if (Number.isNaN(notificationDate.getTime())) {
    return null;
  }

  return notificationDate;
}

function getReminderText(
  minutesBefore: ReminderOption
): string {
  switch (minutesBefore) {
    case 0:
      return "Es momento de realizar esta tarea.";

    case 10:
      return "Esta tarea vence en 10 minutos.";

    case 30:
      return "Esta tarea vence en 30 minutos.";

    case 60:
      return "Esta tarea vence en 1 hora.";

    case 1440:
      return "Esta tarea vence mañana.";

    default:
      return "Tienes una tarea próxima a vencer.";
  }
}

export const notificationService = {
  async initialize(): Promise<boolean> {
    try {
      if (Platform.OS === "web") {
        return false;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(
          CHANNEL_ID,
          {
            name: "Recordatorios de tareas",
            description:
              "Notificaciones de tareas próximas a vencer",
            importance:
              Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: "default",
          }
        );
      }

      const currentPermissions =
        await Notifications.getPermissionsAsync();

      let finalStatus = currentPermissions.status;

      if (finalStatus !== "granted") {
        const requestedPermissions =
          await Notifications.requestPermissionsAsync();

        finalStatus = requestedPermissions.status;
      }

      return finalStatus === "granted";
    } catch (error) {
      console.error(
        "Error al inicializar notificaciones:",
        error
      );

      return false;
    }
  },

  async scheduleTaskReminder({
    taskId,
    title,
    dueDate,
    dueTime,
    minutesBefore,
  }: {
    taskId: string;
    title: string;
    dueDate: string;
    dueTime: string;
    minutesBefore: ReminderOption;
  }): Promise<string | undefined> {
    try {
      if (Platform.OS === "web") {
        return undefined;
      }

      const permissionGranted =
        await this.initialize();

      if (!permissionGranted) {
        return undefined;
      }

      const notificationDate =
        createNotificationDate(
          dueDate,
          dueTime,
          minutesBefore
        );

      if (!notificationDate) {
        throw new Error(
          "La fecha u hora del recordatorio no es válida."
        );
      }

      if (notificationDate.getTime() <= Date.now()) {
        throw new Error(
          "La hora del recordatorio ya pasó."
        );
      }

      const notificationId =
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `⏰ ${title}`,
            body: getReminderText(minutesBefore),
            sound: "default",
            data: {
              taskId,
              url: `/(tabs)/tasks`,
            },
          },

          trigger: {
            type:
              Notifications
                .SchedulableTriggerInputTypes.DATE,

            date: notificationDate,

            channelId:
              Platform.OS === "android"
                ? CHANNEL_ID
                : undefined,
          },
        });

      return notificationId;
    } catch (error) {
      console.error(
        "Error al programar notificación:",
        error
      );

      throw error;
    }
  },

  async cancelNotification(
    notificationId?: string
  ): Promise<void> {
    if (!notificationId || Platform.OS === "web") {
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(
        notificationId
      );
    } catch (error) {
      console.error(
        "Error al cancelar notificación:",
        error
      );
    }
  },
};