package com.tasksyncpro.wearos.presentation.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Icon
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.data.Task
import com.tasksyncpro.wearos.presentation.data.TaskStatus
import com.tasksyncpro.wearos.presentation.ui.theme.*

@Composable
fun TaskListItem(
    task: Task,
    accentColor: Color,
    trailingIcon: ImageVector = Icons.Filled.Schedule,
    onTrailingClick: () -> Unit = {},
    showActions: Boolean = false,
    showCompleteAction: Boolean = true,
    onComplete: () -> Unit = {},
    onEdit: () -> Unit = {},
    onDelete: () -> Unit = {},
    modifier: Modifier = Modifier
) {

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .background(
                color = CardDark,
                shape = RoundedCornerShape(18.dp)
            )
            .border(
                width = 1.dp,
                color = accentColor,
                shape = RoundedCornerShape(18.dp)
            )
            .padding(
                horizontal = 12.dp,
                vertical = 10.dp
            )
    ) {

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {

            Column(
                modifier = Modifier.weight(1f)
            ) {

                Text(
                    text = task.title,
                    color = TextPrimary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                if (task.description.isNotBlank()) {

                    Text(
                        text = task.description,
                        color = TextSecondary,
                        fontSize = 10.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Icon(
                imageVector = trailingIcon,
                contentDescription = null,
                tint = accentColor,
                modifier = Modifier
                    .size(22.dp)
                    .clickable {
                        onTrailingClick()
                    }
            )
        }

        Spacer(
            modifier = Modifier.height(5.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {

            Text(
                text = task.dateTime,
                color = TextSecondary,
                fontSize = 9.sp,
                modifier = Modifier.weight(1f)
            )

            if (task.isPriority) {

                Text(
                    text = "ALTA",
                    color = Color.White,
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .background(
                            RedPrimary,
                            RoundedCornerShape(10.dp)
                        )
                        .padding(
                            horizontal = 6.dp,
                            vertical = 2.dp
                        )
                )
            }
        }

        if (showActions) {

            Spacer(
                modifier = Modifier.height(7.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {

                if (
                    showCompleteAction &&
                    task.status == TaskStatus.PENDING
                ) {

                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .background(
                                GreenPrimary,
                                CircleShape
                            )
                            .clickable {
                                onComplete()
                            },
                        contentAlignment = Alignment.Center
                    ) {

                        Icon(
                            imageVector = Icons.Filled.Check,
                            contentDescription = "Terminar tarea",
                            tint = Color.White,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Spacer(
                        modifier = Modifier.width(10.dp)
                    )
                }

                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .background(
                            RedPrimary,
                            CircleShape
                        )
                        .clickable {
                            onDelete()
                        },
                    contentAlignment = Alignment.Center
                ) {

                    Icon(
                        imageVector = Icons.Filled.Delete,
                        contentDescription = "Eliminar tarea",
                        tint = Color.White,
                        modifier = Modifier.size(19.dp)
                    )
                }
            }
        }
    }
}