package com.tasksyncpro.wearos.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.PriorityHigh
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Button
import androidx.wear.compose.material.Icon
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.data.TaskStatus
import com.tasksyncpro.wearos.presentation.data.TaskViewModel
import com.tasksyncpro.wearos.presentation.ui.components.BottomNavBar
import com.tasksyncpro.wearos.presentation.ui.theme.*

@Composable
fun TaskDetailScreen(
    taskId: String,
    viewModel: TaskViewModel,
    onDeleted: () -> Unit,
    onHome: () -> Unit,
    onBack: () -> Unit
) {

    val tasks by viewModel.tasks.collectAsState()

    val task =
        tasks.find {
            it.id == taskId
        }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundBlack)
    ) {

        if (task == null) {

            Column(
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(horizontal = 40.dp),
                horizontalAlignment =
                    Alignment.CenterHorizontally
            ) {

                Text(
                    text = "Tarea no encontrada",
                    color = TextPrimary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
            }

        } else {

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(
                        start = 32.dp,
                        end = 32.dp,
                        top = 25.dp,
                        bottom = 52.dp
                    ),
                horizontalAlignment =
                    Alignment.CenterHorizontally
            ) {

                /*
                 * INDICADOR SUPERIOR
                 */
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .background(
                            color =
                                when {

                                    task.isPriority ->
                                        RedPrimary

                                    task.status ==
                                            TaskStatus.COMPLETED ->
                                        GreenPrimary

                                    else ->
                                        OrangePrimary
                                },

                            shape = CircleShape
                        ),

                    contentAlignment =
                        Alignment.Center
                ) {

                    Icon(
                        imageVector =
                            when {

                                task.isPriority ->
                                    Icons.Filled.PriorityHigh

                                task.status ==
                                        TaskStatus.COMPLETED ->
                                    Icons.Filled.Check

                                else ->
                                    Icons.Filled.Schedule
                            },

                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(23.dp)
                    )
                }

                Spacer(
                    modifier =
                        Modifier.height(7.dp)
                )

                /*
                 * TÍTULO
                 */
                Text(
                    text = task.title,
                    color = TextPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                /*
                 * DESCRIPCIÓN
                 */
                if (task.description.isNotBlank()) {

                    Text(
                        text = task.description,
                        color = TextSecondary,
                        fontSize = 10.sp,
                        textAlign = TextAlign.Center,
                        modifier =
                            Modifier.padding(top = 3.dp),
                        maxLines = 2
                    )
                }

                Spacer(
                    modifier =
                        Modifier.height(8.dp)
                )

                /*
                 * FECHA
                 */
                Text(
                    text = "📅 ${task.dateTime}",
                    color = TextSecondary,
                    fontSize = 10.sp
                )

                Spacer(
                    modifier =
                        Modifier.height(5.dp)
                )

                /*
                 * ESTADO
                 */
                Text(
                    text =
                        if (
                            task.status ==
                            TaskStatus.COMPLETED
                        )
                            "✓ Completada"
                        else
                            "Pendiente",

                    color =
                        if (
                            task.status ==
                            TaskStatus.COMPLETED
                        )
                            GreenPrimary
                        else
                            OrangePrimary,

                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold
                )

                if (task.isPriority) {

                    Text(
                        text = "Prioridad alta",
                        color = Color.White,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .padding(top = 5.dp)
                            .background(
                                RedPrimary,
                                RoundedCornerShape(12.dp)
                            )
                            .padding(
                                horizontal = 9.dp,
                                vertical = 3.dp
                            )
                    )
                }

                Spacer(
                    modifier =
                        Modifier.weight(1f)
                )

                /*
                 * ACCIONES
                 */
                Row(
                    horizontalArrangement =
                        Arrangement.spacedBy(15.dp),
                    verticalAlignment =
                        Alignment.CenterVertically
                ) {

                    if (
                        task.status ==
                        TaskStatus.PENDING
                    ) {

                        Button(
                            onClick = {
                                viewModel.markCompleted(
                                    task.id
                                )
                            },

                            modifier =
                                Modifier.size(48.dp),

                            colors =
                                androidx.wear.compose.material.ButtonDefaults
                                    .buttonColors(
                                        backgroundColor =
                                            GreenPrimary
                                    )
                        ) {

                            Icon(
                                imageVector =
                                    Icons.Filled.Check,

                                contentDescription =
                                    "Terminar tarea",

                                tint = Color.White
                            )
                        }
                    }

                    Button(
                        onClick = {

                            viewModel.deleteTask(
                                task.id
                            )

                            onDeleted()
                        },

                        modifier =
                            Modifier.size(48.dp),

                        colors =
                            androidx.wear.compose.material.ButtonDefaults
                                .buttonColors(
                                    backgroundColor =
                                        RedPrimary
                                )
                    ) {

                        Icon(
                            imageVector =
                                Icons.Filled.Delete,

                            contentDescription =
                                "Eliminar tarea",

                            tint = Color.White
                        )
                    }
                }
            }
        }

        BottomNavBar(
            onHome = onHome,
            onBack = onBack,
            modifier =
                Modifier.align(
                    Alignment.BottomCenter
                )
        )
    }
}