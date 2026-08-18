
package com.tasksyncpro.wearos.presentation.data.api

import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.Path

interface TaskSyncApi {

    /*
     * TRAER TAREAS DEL USUARIO
     */
    @GET("api/reminders/user/{userId}")
    suspend fun getUserReminders(
        @Path("userId") userId: Int
    ): ReminderListResponse


    /*
     * TERMINAR TAREA
     */
    @PATCH("api/reminders/{id}/notify")
    suspend fun completeTask(
        @Path("id") id: Int
    ): BasicApiResponse


    /*
     * ELIMINAR TAREA
     */
    @DELETE("api/reminders/{id}")
    suspend fun deleteTask(
        @Path("id") id: Int
    ): BasicApiResponse
}