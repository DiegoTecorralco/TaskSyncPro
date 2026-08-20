package com.tasksyncpro.wearos.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PriorityHigh
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.data.TaskStatus
import com.tasksyncpro.wearos.presentation.data.TaskViewModel
import com.tasksyncpro.wearos.presentation.ui.components.BottomNavBar
import com.tasksyncpro.wearos.presentation.ui.components.TaskListItem
import com.tasksyncpro.wearos.presentation.ui.theme.*

@Composable
fun PrioridadesScreen(
    viewModel: TaskViewModel,
    onHome: () -> Unit,
    onBack: () -> Unit
) {

    val tasks by viewModel.tasks.collectAsState()

    val prioridades = tasks.filter {
        it.isPriority
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundBlack)
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(
                    start = 28.dp,
                    end = 28.dp,
                    top = 22.dp,
                    bottom = 50.dp
                ),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Text(
                text = "Prioridades",
                color = RedPrimary,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .verticalScroll(
                        rememberScrollState()
                    )
            ) {

                if (prioridades.isEmpty()) {

                    Text(
                        text = "Sin tareas prioritarias",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        modifier = Modifier
                            .align(
                                Alignment.CenterHorizontally
                            )
                            .padding(top = 35.dp)
                    )
                }

                prioridades.forEach { task ->

                    TaskListItem(
                        task = task,
                        accentColor = RedPrimary,
                        trailingIcon =
                            Icons.Filled.PriorityHigh,

                        showActions = true,

                        showCompleteAction =
                            task.status ==
                                    TaskStatus.PENDING,

                        onComplete = {

                            viewModel.markCompleted(
                                task.id
                            )
                        },

                        onDelete = {

                            viewModel.deleteTask(
                                task.id
                            )
                        }
                    )
                }
            }
        }

        BottomNavBar(
            onHome = onHome,
            onBack = onBack,
            modifier = Modifier
                .align(Alignment.BottomCenter)
        )
    }
}