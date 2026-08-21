package com.tasksyncpro.wearos.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowLeft
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Icon
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.data.Task
import com.tasksyncpro.wearos.presentation.data.TaskStatus
import com.tasksyncpro.wearos.presentation.data.TaskViewModel
import com.tasksyncpro.wearos.presentation.ui.components.BottomNavBar
import com.tasksyncpro.wearos.presentation.ui.theme.*
import java.time.LocalDate
import java.time.YearMonth

@Composable
fun CalendarioScreen(
    viewModel: TaskViewModel,
    onTaskSelected: (String) -> Unit,
    onHome: () -> Unit,
    onBack: () -> Unit
) {

    val tasks by viewModel.tasks.collectAsState()

    var selectedDate by remember {
        mutableStateOf(LocalDate.now())
    }

    var displayedMonth by remember {
        mutableStateOf(YearMonth.now())
    }

    val tasksByDate = remember(tasks) {

        tasks.mapNotNull { task ->

            parseTaskDate(task.dateTime)?.let { date ->
                date to task
            }

        }.groupBy(
            keySelector = {
                it.first
            },
            valueTransform = {
                it.second
            }
        )
    }

    val selectedTasks =
        tasksByDate[selectedDate] ?: emptyList()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundBlack)
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(
                    start = 22.dp,
                    end = 22.dp,
                    top = 18.dp,
                    bottom = 46.dp
                ),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Text(
                text = "Calendario",
                color = PurplePrimary,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {

                CalendarNavigationButton(
                    left = true
                ) {
                    displayedMonth =
                        displayedMonth.minusMonths(1)

                    selectedDate =
                        displayedMonth.atDay(1)
                }

                Text(
                    text =
                        "${monthName(displayedMonth.monthValue)} ${displayedMonth.year}",
                    color = TextPrimary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )

                CalendarNavigationButton(
                    left = false
                ) {
                    displayedMonth =
                        displayedMonth.plusMonths(1)

                    selectedDate =
                        displayedMonth.atDay(1)
                }
            }

            Spacer(
                modifier = Modifier.height(3.dp)
            )

            WeekHeader()

            CalendarMonthGrid(
                month = displayedMonth,
                selectedDate = selectedDate,
                tasksByDate = tasksByDate,

                onDateSelected = { date ->

                    val dayTasks =
                        tasksByDate[date] ?: emptyList()

                    selectedDate = date

                    /*
                     * Si el día tiene una tarea,
                     * entramos directamente al detalle.
                     */
                    if (dayTasks.isNotEmpty()) {

                        onTaskSelected(
                            dayTasks.first().id
                        )
                    }
                }
            )

            Spacer(
                modifier = Modifier.height(4.dp)
            )

            Text(
                text =
                    "${selectedDate.dayOfMonth} de ${monthName(selectedDate.monthValue)}",
                color = TextPrimary,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold
            )

            if (selectedTasks.isEmpty()) {

                Text(
                    text = "Sin tareas",
                    color = TextSecondary,
                    fontSize = 9.sp
                )

            } else {

                val completed =
                    selectedTasks.count {
                        it.status ==
                                TaskStatus.COMPLETED
                    }

                Text(
                    text =
                        "${selectedTasks.size} tarea(s) • $completed completada(s)",
                    color = TextSecondary,
                    fontSize = 8.sp
                )
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

@Composable
private fun WeekHeader() {

    val days =
        listOf(
            "L",
            "M",
            "M",
            "J",
            "V",
            "S",
            "D"
        )

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement =
            Arrangement.SpaceEvenly
    ) {

        days.forEach { day ->

            Box(
                modifier = Modifier.width(25.dp),
                contentAlignment = Alignment.Center
            ) {

                Text(
                    text = day,
                    color = TextSecondary,
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
private fun CalendarMonthGrid(
    month: YearMonth,
    selectedDate: LocalDate,
    tasksByDate: Map<LocalDate, List<Task>>,
    onDateSelected: (LocalDate) -> Unit
) {

    val firstDate =
        month.atDay(1)

    val firstPosition =
        firstDate.dayOfWeek.value - 1

    val numberOfDays =
        month.lengthOfMonth()

    var dayNumber = 1

    repeat(6) { row ->

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement =
                Arrangement.SpaceEvenly
        ) {

            repeat(7) { column ->

                val position =
                    row * 7 + column

                if (
                    position >= firstPosition &&
                    dayNumber <= numberOfDays
                ) {

                    val date =
                        month.atDay(dayNumber)

                    CalendarDay(
                        date = date,

                        selected =
                            date == selectedDate,

                        tasks =
                            tasksByDate[date]
                                ?: emptyList(),

                        onClick = {
                            onDateSelected(date)
                        }
                    )

                    dayNumber++

                } else {

                    Spacer(
                        modifier = Modifier
                            .size(25.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun CalendarDay(
    date: LocalDate,
    selected: Boolean,
    tasks: List<Task>,
    onClick: () -> Unit
) {

    val taskColor =
        when {

            tasks.any {
                it.isPriority &&
                        it.status ==
                        TaskStatus.PENDING
            } ->
                RedPrimary

            tasks.any {
                it.status ==
                        TaskStatus.PENDING
            } ->
                OrangePrimary

            tasks.isNotEmpty() ->
                GreenPrimary

            else ->
                Color.Transparent
        }

    Box(
        modifier = Modifier
            .size(25.dp)
            .background(
                color =
                    if (selected)
                        PurplePrimary
                    else
                        Color.Transparent,

                shape = CircleShape
            )
            .then(

                if (
                    tasks.isNotEmpty() &&
                    !selected
                ) {

                    Modifier.border(
                        width = 1.5.dp,
                        color = taskColor,
                        shape = CircleShape
                    )

                } else {

                    Modifier
                }
            )
            .clickable {
                onClick()
            },

        contentAlignment =
            Alignment.Center
    ) {

        Text(
            text =
                date.dayOfMonth.toString(),

            color =
                if (selected)
                    Color.White
                else
                    TextPrimary,

            fontSize = 8.sp,

            fontWeight =
                if (
                    selected ||
                    tasks.isNotEmpty()
                )
                    FontWeight.Bold
                else
                    FontWeight.Normal
        )
    }
}

@Composable
private fun CalendarNavigationButton(
    left: Boolean,
    onClick: () -> Unit
) {

    Box(
        modifier = Modifier
            .size(29.dp)
            .background(
                PurpleDark,
                CircleShape
            )
            .clickable {
                onClick()
            },

        contentAlignment =
            Alignment.Center
    ) {

        Icon(
            imageVector =
                if (left)
                    Icons.Filled.KeyboardArrowLeft
                else
                    Icons.Filled.KeyboardArrowRight,

            contentDescription =
                if (left)
                    "Mes anterior"
                else
                    "Mes siguiente",

            tint = Color.White,

            modifier =
                Modifier.size(20.dp)
        )
    }
}

private fun parseTaskDate(
    value: String
): LocalDate? {

    val regex =
        Regex(
            """(\d{1,2})-(\d{1,2})-(\d{2,4})"""
        )

    val match =
        regex.find(value)
            ?: return null

    return try {

        val day =
            match.groupValues[1]
                .toInt()

        val month =
            match.groupValues[2]
                .toInt()

        var year =
            match.groupValues[3]
                .toInt()

        if (year < 100) {
            year += 2000
        }

        LocalDate.of(
            year,
            month,
            day
        )

    } catch (e: Exception) {

        null
    }
}

private fun monthName(
    month: Int
): String {

    return listOf(
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    )[month - 1]
}