package com.tasksyncpro.wearos.presentation.data

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update

class TaskViewModel : ViewModel() {

    private val _tasks = MutableStateFlow(
        listOf(
            Task(
                title = "Entregar avance",
                description = "TaskSync Pro",
                dateTime = "14-08-26",
                status = TaskStatus.PENDING,
                isPriority = true
            ),
            Task(
                title = "Revisar documentación",
                description = "Escuela",
                dateTime = "15-08-26",
                status = TaskStatus.PENDING
            ),
            Task(
                title = "Preparar exposición",
                description = "TaskSync Pro",
                dateTime = "18-08-26",
                status = TaskStatus.PENDING
            ),
            Task(
                title = "Comprar materiales",
                description = "Personal",
                dateTime = "20-08-26",
                status = TaskStatus.PENDING
            ),
            Task(
                title = "Terminar el figma",
                description = "Figma",
                dateTime = "29-08-26",
                status = TaskStatus.COMPLETED,
                isPriority = true
            )
        )
    )

    val tasks: StateFlow<List<Task>> = _tasks

    val allTasks: List<Task>
        get() = _tasks.value

    val pendingTasks: List<Task>
        get() = _tasks.value.filter {
            it.status == TaskStatus.PENDING
        }

    val completedTasks: List<Task>
        get() = _tasks.value.filter {
            it.status == TaskStatus.COMPLETED
        }

    val priorityTasks: List<Task>
        get() = _tasks.value.filter {
            it.isPriority
        }

    fun addTask(
        title: String,
        description: String,
        dateTime: String
    ) {

        if (title.isBlank()) return

        _tasks.update {
            it + Task(
                title = title,
                description = description,
                dateTime = dateTime
            )
        }
    }

    fun markCompleted(id: String) {

        _tasks.update { list ->

            list.map { task ->

                if (task.id == id) {
                    task.copy(
                        status = TaskStatus.COMPLETED
                    )
                } else {
                    task
                }
            }
        }
    }

    fun markPending(id: String) {

        _tasks.update { list ->

            list.map { task ->

                if (task.id == id) {
                    task.copy(
                        status = TaskStatus.PENDING
                    )
                } else {
                    task
                }
            }
        }
    }

    fun deleteTask(id: String) {

        _tasks.update { list ->

            list.filterNot {
                it.id == id
            }
        }
    }

    fun togglePriority(id: String) {

        _tasks.update { list ->

            list.map { task ->

                if (task.id == id) {

                    task.copy(
                        isPriority = !task.isPriority
                    )

                } else {

                    task
                }
            }
        }
    }
}