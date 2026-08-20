package com.tasksyncpro.wearos.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
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
fun NotificationScreen(
    viewModel: TaskViewModel,
    onHome: () -> Unit,
    onBack: () -> Unit
) {

    val tasks by viewModel.tasks.collectAsState()

    val avisos = tasks.filter {
        it.status == TaskStatus.PENDING
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
                text = "Avisos",
                color = OrangePrimary,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = "${avisos.size} pendientes",
                color = TextSecondary,
                fontSize = 10.sp,
                modifier = Modifier.padding(
                    bottom = 7.dp
                )
            )

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .verticalScroll(
                        rememberScrollState()
                    )
            ) {

                if (avisos.isEmpty()) {

                    Text(
                        text = "No tienes avisos",
                        color = GreenPrimary,
                        fontSize = 12.sp,
                        modifier = Modifier
                            .align(
                                Alignment.CenterHorizontally
                            )
                            .padding(top = 30.dp)
                    )
                }

                avisos.forEach { task ->

                    TaskListItem(
                        task = task,
                        accentColor =
                            if (task.isPriority)
                                RedPrimary
                            else
                                OrangePrimary,

                        trailingIcon =
                            Icons.Filled.Notifications,

                        showActions = false
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