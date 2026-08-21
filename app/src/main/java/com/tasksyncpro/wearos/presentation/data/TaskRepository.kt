
package com.tasksyncpro.wearos.presentation.data

import android.util.Log
import com.tasksyncpro.wearos.presentation.data.api.ApiConfig
import com.tasksyncpro.wearos.presentation.data.api.ReminderDto
import com.tasksyncpro.wearos.presentation.data.api.RetrofitClient

class TaskRepository {

    private val api =
        RetrofitClient.api


    suspend fun getTasks(): List<Task> {

        Log.d(
            "TaskSyncAPI",
            "Solicitando tareas al backend..."
        )

        val response =
            api.getUserReminders(
                ApiConfig.USER_ID
            )

        if (!response.success) {

            throw Exception(
                response.message
            )
        }

        val tasks =
            response.data
                .orEmpty()
                .map {
                    it.toTask()
                }

        Log.d(
            "TaskSyncAPI",
            "Backend conectado. Tareas recibidas: ${tasks.size}"
        )

        return tasks
    }


    suspend fun completeTask(
        id: String
    ) {

        val response =
            api.completeTask(
                id.toInt()
            )

        if (!response.success) {

            throw Exception(
                response.message
            )
        }

        Log.d(
            "TaskSyncAPI",
            "Tarea $id terminada en MySQL"
        )
    }


    suspend fun deleteTask(
        id: String
    ) {

        val response =
            api.deleteTask(
                id.toInt()
            )

        if (!response.success) {

            throw Exception(
                response.message
            )
        }

        Log.d(
            "TaskSyncAPI",
            "Tarea $id eliminada de MySQL"
        )
    }


    private fun ReminderDto.toTask(): Task {

        return Task(

            id =
                recordatorioId.toString(),

            title =
                titulo,

            description =
                descripcion.orEmpty(),

            dateTime =
                formatApiDate(fecha),

            status =
                if (notificado == 1) {
                    TaskStatus.COMPLETED
                } else {
                    TaskStatus.PENDING
                },

            /*
             * Todavía no existe prioridad
             * en recordatorios.
             */
            isPriority = false
        )
    }


    private fun formatApiDate(
        value: String
    ): String {

        val date =
            Regex(
                """(\d{4})-(\d{2})-(\d{2})"""
            ).find(value)

                ?: return value

        val year =
            date.groupValues[1]
                .takeLast(2)

        val month =
            date.groupValues[2]

        val day =
            date.groupValues[3]


        val time =
            Regex(
                """[T ](\d{2}):(\d{2})"""
            ).find(value)


        return if (time != null) {

            val hour =
                time.groupValues[1]

            val minute =
                time.groupValues[2]

            "$day-$month-$year $hour:$minute"

        } else {

            "$day-$month-$year"
        }
    }
}