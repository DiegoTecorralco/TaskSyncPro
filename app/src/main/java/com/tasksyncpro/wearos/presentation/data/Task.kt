package com.tasksyncpro.wearos.presentation.data

import java.util.UUID

enum class TaskStatus {
    PENDING,
    COMPLETED
}

data class Task(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String = "",
    val dateTime: String = "",
    val status: TaskStatus = TaskStatus.PENDING,
    val isPriority: Boolean = false
)
