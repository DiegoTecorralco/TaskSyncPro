package com.tasksyncpro.wearos.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import com.tasksyncpro.wearos.presentation.data.TaskViewModel
import com.tasksyncpro.wearos.presentation.navigation.TaskSyncProNavGraph
import com.tasksyncpro.wearos.presentation.ui.theme.TaskSyncProTheme

class MainActivity : ComponentActivity() {

    private val taskViewModel: TaskViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TaskSyncProTheme {
                TaskSyncProNavGraph(viewModel = taskViewModel)
            }
        }
    }
}
