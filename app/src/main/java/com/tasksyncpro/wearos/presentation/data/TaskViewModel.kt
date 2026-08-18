package com.tasksyncpro.wearos.presentation.data

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class TaskViewModel : ViewModel() {

    private val repository =
        TaskRepository()


    private val _tasks =
        MutableStateFlow<List<Task>>(
            emptyList()
        )

    val tasks: StateFlow<List<Task>> =
        _tasks


    private val _isLoading =
        MutableStateFlow(true)

    val isLoading: StateFlow<Boolean> =
        _isLoading


    private val _isConnected =
        MutableStateFlow(false)

    val isConnected: StateFlow<Boolean> =
        _isConnected


    private val _errorMessage =
        MutableStateFlow<String?>(
            null
        )

    val errorMessage: StateFlow<String?> =
        _errorMessage


    /*
     * Controla el mensaje inicial.
     *
     * Comienza en true cuando inicia la app.
     * Después de mostrar el estado de conexión
     * se cambia a false.
     *
     * Como está en el ViewModel, al entrar y salir
     * del Dashboard NO vuelve a aparecer.
     */
    private val _showStartupStatus =
        MutableStateFlow(true)

    val showStartupStatus: StateFlow<Boolean> =
        _showStartupStatus


    val allTasks: List<Task>
        get() =
            _tasks.value


    val pendingTasks: List<Task>
        get() =
            _tasks.value.filter {
                it.status ==
                        TaskStatus.PENDING
            }


    val completedTasks: List<Task>
        get() =
            _tasks.value.filter {
                it.status ==
                        TaskStatus.COMPLETED
            }


    val priorityTasks: List<Task>
        get() =
            _tasks.value.filter {
                it.isPriority
            }


    /*
     * Apenas se crea el ViewModel
     * se conecta al backend.
     *
     * Esto ocurre al iniciar TaskSync Pro.
     */
    init {
        refreshTasks()
    }


    fun hideStartupStatus() {
        _showStartupStatus.value =
            false
    }


    fun refreshTasks() {

        viewModelScope.launch {

            _isLoading.value =
                true

            _errorMessage.value =
                null

            try {

                val backendTasks =
                    repository.getTasks()

                _tasks.value =
                    backendTasks

                _isConnected.value =
                    true

                Log.d(
                    "TaskSyncAPI",
                    "CONEXIÓN EXITOSA"
                )

            } catch (e: Exception) {

                _isConnected.value =
                    false

                _errorMessage.value =
                    e.message
                        ?: "Error de conexión"

                Log.e(
                    "TaskSyncAPI",
                    "ERROR DE CONEXIÓN",
                    e
                )

            } finally {

                _isLoading.value =
                    false
            }
        }
    }


    fun markCompleted(
        id: String
    ) {

        val previous =
            _tasks.value

        _tasks.update { list ->

            list.map { task ->

                if (task.id == id) {

                    task.copy(
                        status =
                            TaskStatus.COMPLETED
                    )

                } else {

                    task
                }
            }
        }


        viewModelScope.launch {

            try {

                repository.completeTask(
                    id
                )

                refreshTasks()

            } catch (e: Exception) {

                _tasks.value =
                    previous

                _errorMessage.value =
                    e.message

                Log.e(
                    "TaskSyncAPI",
                    "Error terminando tarea",
                    e
                )
            }
        }
    }


    fun deleteTask(
        id: String
    ) {

        val previous =
            _tasks.value

        _tasks.update { list ->

            list.filterNot {
                it.id == id
            }
        }


        viewModelScope.launch {

            try {

                repository.deleteTask(
                    id
                )

                refreshTasks()

            } catch (e: Exception) {

                _tasks.value =
                    previous

                _errorMessage.value =
                    e.message

                Log.e(
                    "TaskSyncAPI",
                    "Error eliminando tarea",
                    e
                )
            }
        }
    }


    /*
     * Se mantienen para no romper
     * las pantallas anteriores.
     */
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


    fun markPending(
        id: String
    ) {

        _tasks.update { list ->

            list.map { task ->

                if (task.id == id) {

                    task.copy(
                        status =
                            TaskStatus.PENDING
                    )

                } else {

                    task
                }
            }
        }
    }


    fun togglePriority(
        id: String
    ) {

        _tasks.update { list ->

            list.map { task ->

                if (task.id == id) {

                    task.copy(
                        isPriority =
                            !task.isPriority
                    )

                } else {

                    task
                }
            }
        }
    }
}