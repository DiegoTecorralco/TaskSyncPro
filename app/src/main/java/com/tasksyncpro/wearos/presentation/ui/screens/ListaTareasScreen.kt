package com.tasksyncpro.wearos.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.PriorityHigh
import androidx.compose.material.icons.filled.Schedule
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
fun ListaTareasScreen(
    viewModel: TaskViewModel,
    onShowResult: (String) -> Unit,
    onHome: () -> Unit,
    onBack: () -> Unit
) {

    val tasks by viewModel.tasks.collectAsState()

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
                text = "Mis tareas",
                color = TextPrimary,
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

                if (tasks.isEmpty()) {

                    Text(
                        text = "No tienes tareas",
                        color = TextSecondary,
                        fontSize = 12.sp,
                        modifier = Modifier
                            .align(Alignment.CenterHorizontally)
                            .padding(top = 30.dp)
                    )
                }

                tasks.forEach { task ->

                    val accent = when {

                        task.isPriority ->
                            RedPrimary

                        task.status ==
                                TaskStatus.COMPLETED ->
                            GreenPrimary

                        else ->
                            OrangePrimary
                    }

                    val icon = when {

                        task.isPriority ->
                            Icons.Filled.PriorityHigh

                        task.status ==
                                TaskStatus.COMPLETED ->
                            Icons.Filled.CheckCircle

                        else ->
                            Icons.Filled.Schedule
                    }

                    TaskListItem(
                        task = task,
                        accentColor = accent,
                        trailingIcon = icon,
                        showActions = true,
                        showCompleteAction =
                            task.status ==
                                    TaskStatus.PENDING,

                        onComplete = {

                            viewModel.markCompleted(
                                task.id
                            )

                            onShowResult(
                                "completed"
                            )
                        },

                        onDelete = {

                            viewModel.deleteTask(
                                task.id
                            )

                            onShowResult(
                                "deleted"
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