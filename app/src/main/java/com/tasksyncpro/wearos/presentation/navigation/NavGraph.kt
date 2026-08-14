package com.tasksyncpro.wearos.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.tasksyncpro.wearos.presentation.data.TaskViewModel
import com.tasksyncpro.wearos.presentation.ui.screens.*

private enum class AppScreen {

    DASHBOARD,

    TAREAS_MENU,

    LISTA_TAREAS,

    PENDIENTES,

    TERMINADAS,

    PRIORIDADES,

    CALENDARIO,

    NOTIFICACION,

    TASK_DETAIL,

    RESULT_COMPLETED,

    RESULT_DELETED
}

@Composable
fun TaskSyncProNavGraph(
    viewModel: TaskViewModel
) {

    var currentScreen by rememberSaveable {

        mutableStateOf(
            AppScreen.DASHBOARD.name
        )
    }

    /*
     * Guarda qué tarea se seleccionó.
     */
    var selectedTaskId by rememberSaveable {

        mutableStateOf("")
    }

    fun goHome() {

        currentScreen =
            AppScreen.DASHBOARD.name
    }

    fun goBack() {

        currentScreen =
            when (
                AppScreen.valueOf(
                    currentScreen
                )
            ) {

                AppScreen.DASHBOARD ->
                    AppScreen.DASHBOARD.name


                AppScreen.TAREAS_MENU ->
                    AppScreen.DASHBOARD.name


                AppScreen.LISTA_TAREAS ->
                    AppScreen.TAREAS_MENU.name


                AppScreen.PENDIENTES ->
                    AppScreen.TAREAS_MENU.name


                AppScreen.TERMINADAS ->
                    AppScreen.TAREAS_MENU.name


                AppScreen.PRIORIDADES ->
                    AppScreen.DASHBOARD.name


                AppScreen.CALENDARIO ->
                    AppScreen.DASHBOARD.name


                AppScreen.NOTIFICACION ->
                    AppScreen.DASHBOARD.name


                /*
                 * Desde una tarea seleccionada
                 * regresamos al calendario.
                 */
                AppScreen.TASK_DETAIL ->
                    AppScreen.CALENDARIO.name


                AppScreen.RESULT_COMPLETED ->
                    AppScreen.LISTA_TAREAS.name


                AppScreen.RESULT_DELETED ->
                    AppScreen.LISTA_TAREAS.name
            }
    }

    when (
        AppScreen.valueOf(
            currentScreen
        )
    ) {

        // ============================
        // DASHBOARD
        // ============================

        AppScreen.DASHBOARD -> {

            OptionsScreen(

                onTareas = {

                    currentScreen =
                        AppScreen.TAREAS_MENU.name
                },

                onCalendario = {

                    currentScreen =
                        AppScreen.CALENDARIO.name
                },

                onNotificacion = {

                    currentScreen =
                        AppScreen.NOTIFICACION.name
                },

                onPrioridades = {

                    currentScreen =
                        AppScreen.PRIORIDADES.name
                },

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }


        // ============================
        // MENÚ TAREAS
        // ============================

        AppScreen.TAREAS_MENU -> {

            TareasMenuScreen(

                onListaTareas = {

                    currentScreen =
                        AppScreen.LISTA_TAREAS.name
                },

                onPendientes = {

                    currentScreen =
                        AppScreen.PENDIENTES.name
                },

                onTerminadas = {

                    currentScreen =
                        AppScreen.TERMINADAS.name
                },

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }


        // ============================
        // LISTA DE TAREAS
        // ============================

        AppScreen.LISTA_TAREAS -> {

            ListaTareasScreen(

                viewModel = viewModel,

                onShowResult = { result ->

                    currentScreen =

                        if (
                            result == "completed"
                        ) {

                            AppScreen
                                .RESULT_COMPLETED
                                .name

                        } else {

                            AppScreen
                                .RESULT_DELETED
                                .name
                        }
                },

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }


        // ============================
        // PENDIENTES
        // ============================

        AppScreen.PENDIENTES -> {

            PendientesScreen(

                viewModel = viewModel,

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }


        // ============================
        // TERMINADAS
        // ============================

        AppScreen.TERMINADAS -> {

            TerminadasScreen(

                viewModel = viewModel,

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }


        // ============================
        // PRIORIDADES
        // ============================

        AppScreen.PRIORIDADES -> {

            PrioridadesScreen(

                viewModel = viewModel,

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }


        // ============================
        // CALENDARIO
        // ============================

        AppScreen.CALENDARIO -> {

            CalendarioScreen(

                viewModel = viewModel,

                /*
                 * Recibimos el ID de la tarea
                 * que se tocó en el calendario.
                 */
                onTaskSelected = { taskId ->

                    selectedTaskId =
                        taskId

                    currentScreen =
                        AppScreen.TASK_DETAIL.name
                },

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }


        // ============================
        // DETALLE DE TAREA
        // ============================

        AppScreen.TASK_DETAIL -> {

            TaskDetailScreen(

                taskId =
                    selectedTaskId,

                viewModel =
                    viewModel,

                /*
                 * Si eliminamos la tarea,
                 * regresamos al calendario.
                 */
                onDeleted = {

                    currentScreen =
                        AppScreen.CALENDARIO.name
                },

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }


        // ============================
        // NOTIFICACIONES
        // ============================

        AppScreen.NOTIFICACION -> {

            NotificationScreen(

                viewModel = viewModel,

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }


        // ============================
        // RESULTADO COMPLETADA
        // ============================

        AppScreen.RESULT_COMPLETED -> {

            ResultScreen(

                type =
                    ResultType.COMPLETED,

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }


        // ============================
        // RESULTADO ELIMINADA
        // ============================

        AppScreen.RESULT_DELETED -> {

            ResultScreen(

                type =
                    ResultType.DELETED,

                onHome = {
                    goHome()
                },

                onBack = {
                    goBack()
                }
            )
        }
    }
}