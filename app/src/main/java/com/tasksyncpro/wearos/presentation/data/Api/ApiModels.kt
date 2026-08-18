
package com.tasksyncpro.wearos.presentation.data.api

import com.google.gson.annotations.SerializedName

data class ReminderDto(

    @SerializedName("recordatorio_id")
    val recordatorioId: Int,

    @SerializedName("usuario_id")
    val usuarioId: Int,

    @SerializedName("categoria_id")
    val categoriaId: Int? = null,

    val titulo: String,

    val descripcion: String? = null,

    val fecha: String,

    val notificado: Int = 0
)

data class ReminderListResponse(
    val success: Boolean,
    val message: String,
    val data: List<ReminderDto>? = null,
    val error: String? = null
)

data class BasicApiResponse(
    val success: Boolean,
    val message: String,
    val error: String? = null
)