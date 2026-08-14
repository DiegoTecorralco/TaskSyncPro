package com.tasksyncpro.wearos.presentation.ui.theme

import androidx.compose.runtime.Composable
import androidx.wear.compose.material.Colors
import androidx.wear.compose.material.MaterialTheme

private val TaskSyncProColors = Colors(
    primary = GreenPrimary,
    primaryVariant = GreenPrimary,
    secondary = BluePrimary,
    secondaryVariant = BluePrimary,
    error = RedPrimary,
    background = BackgroundBlack,
    surface = SurfaceDark,
    onPrimary = TextPrimary,
    onSecondary = TextPrimary,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    onError = TextPrimary
)

@Composable
fun TaskSyncProTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colors = TaskSyncProColors,
        content = content
    )
}
