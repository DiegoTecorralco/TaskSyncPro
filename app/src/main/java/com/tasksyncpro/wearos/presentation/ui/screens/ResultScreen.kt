package com.tasksyncpro.wearos.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Icon
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.ui.components.BottomNavBar
import com.tasksyncpro.wearos.presentation.ui.theme.*

enum class ResultType {
    ADDED,
    COMPLETED,
    DELETED
}

@Composable
fun ResultScreen(
    type: ResultType,
    onHome: () -> Unit,
    onBack: () -> Unit
) {

    val isCompleted =
        type == ResultType.COMPLETED

    val color =
        if (isCompleted)
            GreenPrimary
        else
            RedPrimary

    val text =
        when (type) {

            ResultType.COMPLETED ->
                "Tarea terminada"

            ResultType.DELETED ->
                "Tarea eliminada"

            ResultType.ADDED ->
                "Tarea agregada"
        }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundBlack)
    ) {

        Column(
            modifier = Modifier
                .align(Alignment.Center)
                .padding(
                    horizontal = 35.dp
                ),
            horizontalAlignment =
                Alignment.CenterHorizontally
        ) {

            Box(
                modifier = Modifier
                    .size(70.dp)
                    .background(
                        color,
                        CircleShape
                    ),
                contentAlignment =
                    Alignment.Center
            ) {

                Icon(
                    imageVector =
                        if (isCompleted)
                            Icons.Filled.Check
                        else
                            Icons.Filled.Delete,

                    contentDescription = null,

                    tint = Color.White,

                    modifier = Modifier.size(
                        36.dp
                    )
                )
            }

            Text(
                text = text,
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(
                    top = 12.dp
                )
            )

            Text(
                text =
                    if (isCompleted)
                        "Se actualizó correctamente"
                    else
                        "Se eliminó de tu lista",

                color = TextSecondary,
                fontSize = 10.sp,
                modifier = Modifier.padding(
                    top = 3.dp
                )
            )
        }

        BottomNavBar(
            onHome = onHome,
            onBack = onBack,
            modifier = Modifier
                .align(Alignment.BottomCenter)
        )
    }
}