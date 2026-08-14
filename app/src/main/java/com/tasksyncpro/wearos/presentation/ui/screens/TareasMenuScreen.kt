package com.tasksyncpro.wearos.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ListAlt
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Icon
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.ui.components.BottomNavBar
import com.tasksyncpro.wearos.presentation.ui.theme.BackgroundBlack
import com.tasksyncpro.wearos.presentation.ui.theme.GreenPrimary
import com.tasksyncpro.wearos.presentation.ui.theme.OrangePrimary
import com.tasksyncpro.wearos.presentation.ui.theme.PurplePrimary
import com.tasksyncpro.wearos.presentation.ui.theme.TextPrimary

@Composable
fun TareasMenuScreen(
    onListaTareas: () -> Unit,
    onPendientes: () -> Unit,
    onTerminadas: () -> Unit,
    onHome: () -> Unit,
    onBack: () -> Unit
) {

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundBlack)
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(
                    start = 34.dp,
                    end = 34.dp,
                    top = 22.dp,
                    bottom = 45.dp
                ),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {

            Text(
                text = "Mis tareas",
                color = TextPrimary,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 10.dp)
            )

            TaskMenuButton(
                text = "Lista de tareas",
                icon = Icons.Filled.ListAlt,
                color = PurplePrimary,
                onClick = onListaTareas
            )

            TaskMenuButton(
                text = "Pendientes",
                icon = Icons.Filled.Schedule,
                color = OrangePrimary,
                onClick = onPendientes
            )

            TaskMenuButton(
                text = "Terminadas",
                icon = Icons.Filled.CheckCircle,
                color = GreenPrimary,
                onClick = onTerminadas
            )
        }

        BottomNavBar(
            onHome = onHome,
            onBack = onBack,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}

@Composable
private fun TaskMenuButton(
    text: String,
    icon: ImageVector,
    color: Color,
    onClick: () -> Unit
) {

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 3.dp)
            .height(43.dp)
            .background(
                color = color,
                shape = RoundedCornerShape(24.dp)
            )
            .clickable {
                onClick()
            }
            .padding(horizontal = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {

        Icon(
            imageVector = icon,
            contentDescription = text,
            tint = Color.White
        )

        Text(
            text = text,
            color = Color.White,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(start = 10.dp),
            maxLines = 1
        )
    }
}