package com.tasksyncpro.wearos.presentation.ui.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bluetooth
import androidx.compose.material.icons.filled.BatteryFull
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Icon
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.ui.theme.BatteryGreen

/**
 * Barra superior repetida en todas las pantallas de la app:
 * título/fecha a la izquierda, bluetooth + batería + hora a la derecha.
 * Corresponde a lo que se ve en "options", "tareas", "lista tareas", etc.
 */
@Composable
fun TopStatusBar(
    title: String,
    time: String = "3:00",
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 2.dp),
        horizontalArrangement = androidx.compose.foundation.layout.Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            fontSize = 14.sp,
            color = MaterialTheme.colors.onBackground
        )
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = Icons.Filled.Bluetooth,
                contentDescription = "Bluetooth",
                modifier = Modifier.size(12.dp),
                tint = MaterialTheme.colors.onBackground
            )
            Icon(
                imageVector = Icons.Filled.BatteryFull,
                contentDescription = "Batería",
                modifier = Modifier.padding(start = 4.dp).size(14.dp),
                tint = BatteryGreen
            )
            Text(
                text = time,
                fontSize = 12.sp,
                modifier = Modifier.padding(start = 4.dp),
                color = MaterialTheme.colors.onBackground
            )
        }
    }
}
