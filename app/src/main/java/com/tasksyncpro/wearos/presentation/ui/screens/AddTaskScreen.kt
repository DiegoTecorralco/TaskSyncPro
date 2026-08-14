package com.tasksyncpro.wearos.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Mic
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.wear.compose.material.Button
import androidx.wear.compose.material.ButtonDefaults
import androidx.wear.compose.material.Icon
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Text
import com.tasksyncpro.wearos.presentation.data.TaskViewModel
import com.tasksyncpro.wearos.presentation.ui.components.BottomNavBar
import com.tasksyncpro.wearos.presentation.ui.components.TopStatusBar
import com.tasksyncpro.wearos.presentation.ui.theme.BackgroundBlack
import com.tasksyncpro.wearos.presentation.ui.theme.GreenPrimary

/**
 * Pantalla "añadir tarea": Titulo, Descripcion, Fecha y hora + botón mic (dictado)
 * y botón "+" que agrega la tarea de verdad al ViewModel y navega al result screen.
 *
 * NOTA: se usa Column + verticalScroll en vez de LazyColumn porque son solo
 * 4-5 elementos fijos; así evitamos depender de la API "item" de listas
 * perezosas, que en algunos setups de Wear OS da problemas de resolución.
 *
 * El botón de micrófono queda con el listener conectado, listo para
 * enchufar SpeechRecognizer/RecognizerIntent de Android cuando agregues el
 * permiso RECORD_AUDIO; por ahora solo dispara la acción como placeholder.
 */
@Composable
fun AddTaskScreen(
    viewModel: TaskViewModel,
    onTaskAdded: () -> Unit,
    onHome: () -> Unit,
    onBack: () -> Unit
) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var dateTime by remember { mutableStateOf("") }

    Column(
        modifier = Modifier.fillMaxSize().background(BackgroundBlack).padding(12.dp)
    ) {
        TopStatusBar(title = "Añadir tarea")

        Column(
            modifier = Modifier
                .weight(1f, fill = true)
                .verticalScroll(rememberScrollState())
        ) {
            Text(text = "Nueva tarea", fontWeight = FontWeight.Bold, color = MaterialTheme.colors.onBackground)

            SimpleField(label = "Titulo", value = title, onValueChange = { title = it })
            SimpleField(label = "Descripcion", value = description, onValueChange = { description = it })
            SimpleField(label = "Fecha y hora", value = dateTime, onValueChange = { dateTime = it })

            Row(
                modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
                horizontalArrangement = androidx.compose.foundation.layout.Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(onClick = { /* TODO: enchufar SpeechRecognizer aquí */ }) {
                    Icon(imageVector = Icons.Filled.Mic, contentDescription = "Dictar")
                }
                Button(
                    onClick = {
                        viewModel.addTask(title, description, dateTime)
                        onTaskAdded()
                    },
                    colors = ButtonDefaults.buttonColors(backgroundColor = GreenPrimary)
                ) {
                    Icon(imageVector = Icons.Filled.Add, contentDescription = "Agregar")
                }
            }
        }
        BottomNavBar(onHome = onHome, onBack = onBack)
    }
}

@Composable
private fun SimpleField(label: String, value: String, onValueChange: (String) -> Unit) {
    // Wear Compose no trae un TextField "bonito" listo para reloj; usamos un
    // campo simple basado en BasicTextField para mantenerlo ligero y funcional.
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Text(text = label, color = com.tasksyncpro.wearos.presentation.ui.theme.TextSecondary, style = MaterialTheme.typography.caption2)
        androidx.compose.foundation.text.BasicTextField(
            value = value,
            onValueChange = onValueChange,
            textStyle = androidx.compose.ui.text.TextStyle(color = MaterialTheme.colors.onBackground),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 4.dp)
        )
    }
}
