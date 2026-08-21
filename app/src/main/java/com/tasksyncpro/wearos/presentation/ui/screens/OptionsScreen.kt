package com.tasksyncpro.wearos.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Checklist
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.PriorityHigh
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Icon
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.data.TaskViewModel
import com.tasksyncpro.wearos.presentation.ui.theme.BackgroundBlack
import com.tasksyncpro.wearos.presentation.ui.theme.BluePrimary
import com.tasksyncpro.wearos.presentation.ui.theme.GreenPrimary
import com.tasksyncpro.wearos.presentation.ui.theme.OrangePrimary
import com.tasksyncpro.wearos.presentation.ui.theme.PurplePrimary
import com.tasksyncpro.wearos.presentation.ui.theme.RedPrimary
import com.tasksyncpro.wearos.presentation.ui.theme.TextPrimary
import com.tasksyncpro.wearos.presentation.ui.theme.TextSecondary
import kotlinx.coroutines.delay


@Composable
fun OptionsScreen(
    viewModel: TaskViewModel,
    onTareas: () -> Unit,
    onCalendario: () -> Unit,
    onNotificacion: () -> Unit,
    onPrioridades: () -> Unit,
    onHome: () -> Unit,
    onBack: () -> Unit
) {

    val connected by
    viewModel.isConnected.collectAsState()

    val loading by
    viewModel.isLoading.collectAsState()

    val errorMessage by
    viewModel.errorMessage.collectAsState()

    val showStartupStatus by
    viewModel.showStartupStatus.collectAsState()

    val tasks by
    viewModel.tasks.collectAsState()


    /*
     * SOLO PARA EL INICIO DE LA APP.
     *
     * Esperamos a que termine la conexión.
     *
     * Después mostramos el resultado
     * durante 2 segundos.
     *
     * Luego se oculta definitivamente
     * mientras la aplicación siga abierta.
     */
    LaunchedEffect(
        showStartupStatus,
        loading,
        connected,
        errorMessage
    ) {

        if (
            showStartupStatus &&
            !loading &&
            (
                    connected ||
                            errorMessage != null
                    )
        ) {

            delay(2000)

            viewModel.hideStartupStatus()
        }
    }


    Box(
        modifier =
            Modifier
                .fillMaxSize()
                .background(
                    BackgroundBlack
                ),

        contentAlignment =
            Alignment.Center
    ) {

        Column(
            modifier =
                Modifier.fillMaxWidth(
                    0.82f
                ),

            horizontalAlignment =
                Alignment.CenterHorizontally,

            verticalArrangement =
                Arrangement.Center
        ) {


            Text(
                text =
                    "TaskSync Pro",

                color =
                    TextPrimary,

                fontSize =
                    17.sp,

                fontWeight =
                    FontWeight.Bold
            )


            /*
             * MENSAJE DE CONEXIÓN
             *
             * SOLO SE MUESTRA AL INICIAR.
             */
            if (showStartupStatus) {

                Text(
                    text =
                        when {

                            loading ->
                                "Conectando..."

                            connected ->
                                "● BIENVENIDO"

                            else ->
                                "● Sin conexión"
                        },

                    color =
                        when {

                            loading ->
                                OrangePrimary

                            connected ->
                                GreenPrimary

                            else ->
                                RedPrimary
                        },

                    fontSize =
                        9.sp,

                    modifier =
                        Modifier.padding(
                            top = 2.dp,
                            bottom = 8.dp
                        )
                )

            } else {

                /*
                 * Conserva un pequeño espacio
                 * para que el diseño no salte.
                 */
                Box(
                    modifier =
                        Modifier.padding(
                            bottom = 8.dp
                        )
                )
            }


            Row(
                modifier =
                    Modifier.fillMaxWidth(),

                horizontalArrangement =
                    Arrangement.SpaceEvenly
            ) {


                DashboardItem(
                    title =
                        "Tareas ${tasks.size}",

                    icon =
                        Icons.Filled.Checklist,

                    color =
                        PurplePrimary,

                    onClick =
                        onTareas
                )


                DashboardItem(
                    title =
                        "Calendario",

                    icon =
                        Icons.Filled.CalendarMonth,

                    color =
                        BluePrimary,

                    onClick =
                        onCalendario
                )
            }


            Row(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(
                            top = 8.dp
                        ),

                horizontalArrangement =
                    Arrangement.SpaceEvenly
            ) {


                DashboardItem(
                    title =
                        "Avisos",

                    icon =
                        Icons.Filled.Notifications,

                    color =
                        OrangePrimary,

                    onClick =
                        onNotificacion
                )


                DashboardItem(
                    title =
                        "Prioridad",

                    icon =
                        Icons.Filled.PriorityHigh,

                    color =
                        RedPrimary,

                    onClick =
                        onPrioridades
                )
            }
        }
    }
}


@Composable
private fun DashboardItem(
    title: String,
    icon: ImageVector,
    color: Color,
    onClick: () -> Unit
) {

    Column(
        horizontalAlignment =
            Alignment.CenterHorizontally,

        modifier =
            Modifier
                .clickable {
                    onClick()
                }
                .padding(
                    horizontal = 4.dp
                )
    ) {


        Box(
            modifier =
                Modifier
                    .size(52.dp)
                    .clip(
                        CircleShape
                    )
                    .background(
                        color
                    ),

            contentAlignment =
                Alignment.Center
        ) {


            Icon(
                imageVector =
                    icon,

                contentDescription =
                    title,

                tint =
                    Color.White,

                modifier =
                    Modifier.size(
                        25.dp
                    )
            )
        }


        Text(
            text =
                title,

            color =
                TextSecondary,

            fontSize =
                8.sp,

            maxLines =
                1,

            modifier =
                Modifier.padding(
                    top = 3.dp
                )
        )
    }
}