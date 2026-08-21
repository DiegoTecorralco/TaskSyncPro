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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DirectionsWalk
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Message
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Icon
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.ui.theme.BackgroundBlack
import com.tasksyncpro.wearos.presentation.ui.theme.GreenPrimary
import com.tasksyncpro.wearos.presentation.ui.theme.BluePrimary

@Composable
fun ClockScreen(onOpenAppGrid: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundBlack)
            .clickable { onOpenAppGrid() }
            .padding(20.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Filled.Message,
                contentDescription = null,
                tint = MaterialTheme.colors.onBackground
            )

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(text = "03", fontSize = 44.sp, color = GreenPrimary, fontWeight = FontWeight.Bold)
                Text(text = "00", fontSize = 44.sp, color = BluePrimary, fontWeight = FontWeight.Bold)
            }

            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Filled.Favorite, contentDescription = "Ritmo cardiaco", tint = androidx.compose.ui.graphics.Color.Red)
                    Text(text = " 68", color = MaterialTheme.colors.onBackground, fontSize = 12.sp)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Filled.DirectionsWalk, contentDescription = "Pasos", tint = MaterialTheme.colors.onBackground)
                    Text(text = " 2548", color = MaterialTheme.colors.onBackground, fontSize = 12.sp)
                }
            }
        }
    }
}