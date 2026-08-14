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
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Icon
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.ui.components.TopStatusBar
import com.tasksyncpro.wearos.presentation.ui.theme.BackgroundBlack

@Composable
fun AppGridScreen(onOpenOptions: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundBlack)
            .padding(12.dp)
    ) {
        TopStatusBar(title = "18-Jun")
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)
            ) {
                GridIcon(icon = Icons.Filled.Notifications, bg = Color(0xFFE53935))
                GridIcon(icon = Icons.Filled.MusicNote, bg = Color(0xFF25D366))
                GridIcon(icon = Icons.Filled.Person, bg = Color(0xFF2E86FF))
            }
            Row(
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)
            ) {
                GridIcon(icon = Icons.Filled.MusicNote, bg = Color(0xFF25D366))
                // Ícono central: TaskSyncPro -> abre la app real
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .background(Color.White, CircleShape)
                        .clickable { onOpenOptions() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "TSP", color = Color.Black, fontSize = 11.sp)
                }
                GridIcon(icon = Icons.Filled.CalendarToday, bg = Color(0xFFE53935))
            }
            Row(
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)
            ) {
                GridIcon(icon = Icons.Filled.Notifications, bg = Color(0xFFE53935))
                GridIcon(icon = Icons.Filled.Timer, bg = Color(0xFFE53935))
                GridIcon(icon = Icons.Filled.Favorite, bg = Color(0xFFE53935))
            }
        }
    }
}

@Composable
private fun GridIcon(icon: androidx.compose.ui.graphics.vector.ImageVector, bg: Color) {
    Box(
        modifier = Modifier
            .size(40.dp)
            .background(bg, CircleShape),
        contentAlignment = Alignment.Center
    ) {
        Icon(imageVector = icon, contentDescription = null, tint = Color.White)
    }
}