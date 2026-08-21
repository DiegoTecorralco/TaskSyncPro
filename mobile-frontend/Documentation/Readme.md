# TaskSync Pro

TaskSync Pro es una aplicación móvil para la gestión de tareas personales. Permite que cada usuario cree una cuenta, inicie sesión y administre sus actividades de manera independiente mediante tareas, categorías, fechas límite y un calendario.

La aplicación fue desarrollada con **React Native**, **Expo Router** y **TypeScript**. Actualmente utiliza **AsyncStorage** para almacenar localmente los usuarios, sesiones, tareas y categorías.

---

##  Descripción del proyecto

TaskSync Pro tiene como objetivo ayudar a los usuarios a organizar sus actividades diarias desde un dispositivo móvil.

Cada persona puede registrarse con una cuenta propia y acceder a un espacio independiente. Esto significa que las tareas, categorías, estadísticas y datos de una cuenta no se mezclan con los de otros usuarios.

Cuando una persona se registra por primera vez, su historial comienza completamente vacío.

---

##  Objetivo general

Desarrollar una aplicación móvil de gestión de tareas que permita registrar usuarios, administrar actividades, organizar tareas mediante categorías y consultar pendientes por medio de un calendario y un dashboard.

---

##  Objetivos específicos

- Implementar el registro de usuarios.
- Implementar el inicio y cierre de sesión.
- Mantener activa la sesión del usuario.
- Permitir la creación, edición y eliminación de tareas.
- Permitir marcar tareas como completadas o pendientes.
- Organizar tareas mediante categorías.
- Mostrar las tareas en una vista de calendario.
- Mostrar un resumen general mediante un dashboard.
- Permitir la actualización de información del perfil.
- Separar la información de cada cuenta.
- Guardar la información localmente con AsyncStorage.
- La fecha de creacion y hora para la tarea se puede poner en hora local 

---

##  Funcionalidades implementadas

### Registro de usuarios

La aplicación permite crear una cuenta proporcionando:

- Nombre.
- Correo electrónico.
- Contraseña.
- Confirmación de contraseña.

Durante el registro se realizan validaciones para evitar:

- Campos vacíos.
- Correos electrónicos repetidos.
- Contraseñas que no coincidan.
- Registros con información incompleta.
- Contraseña con caracteres menores al especificado

Cada usuario registrado obtiene un identificador único.

---

### 🔑 Inicio de sesión

Los usuarios pueden iniciar sesión utilizando:

- Correo electrónico.
- Contraseña.

El sistema busca las credenciales en los usuarios almacenados localmente.

Si las credenciales son correctas, se crea una sesión y el usuario es enviado a la pantalla principal.

Si las credenciales son incorrectas, se muestra un mensaje de error.

En caso de no contar con una cuenta se podra agregar una cuenta totalmente nueva se espera poder añadir en futuras actualizaciones la opcion de confirmar correo electronico desde tu Gmail 

---

### 💾 Persistencia de sesión

La sesión del usuario se almacena con AsyncStorage.

Esto permite que, al cerrar y volver a abrir la aplicación, el usuario permanezca autenticado sin tener que introducir nuevamente sus datos.
Permite que el Usuario pueda seguir visualizando sus Tareas sin que estas se pierdan al momento de cerrar la sesion o eliminar la aplicacion 


¡Perfecto! Te dejo la sección de **Próximas Actualizaciones** optimizada para tu README, con tablas claras y formato limpio:

---

## 🔮 Próximas Actualizaciones

A continuación se detallan las funcionalidades planificadas para futuras versiones de TaskSync Pro:

### 🚀 Alta Prioridad

| Funcionalidad | Descripción | Estado | Versión |
|---------------|-------------|--------|---------|
| **Confirmación de correo** | Envío de correo de verificación al registrar una cuenta nueva | 📋 Planificación | v1.1.0 |
| **Foto de perfil** | Seleccionar foto desde galería o tomar con cámara | 📋 Planificación | v1.1.0 |
| **Notificaciones push** | Recordatorios automáticos para tareas próximas a vencer | 📋 Planificación | v1.2.0 |
| **Modo oscuro** | Tema oscuro para mejorar experiencia visual en poca luz | 📋 Planificación | v1.2.0 |

---

### ⚡ Media Prioridad

| Funcionalidad | Descripción | Estado | Versión |
|---------------|-------------|--------|---------|
| **Sincronización en la nube** | Respaldo y sincronización entre múltiples dispositivos | 📋 Evaluación | v2.0.0 |
| **Archivos adjuntos** | Adjuntar imágenes, documentos o archivos a las tareas | 📋 Evaluación | v1.3.0 |
| **Subtareas** | Dividir tareas grandes en subtareas más pequeñas | 📋 Evaluación | v1.3.0 |
| **Etiquetas personalizadas** | Añadir etiquetas de colores para mejor organización visual | 📋 Evaluación | v1.3.0 |

---

### 🌟 Baja Prioridad

| Funcionalidad | Descripción | Estado | Versión |
|---------------|-------------|--------|---------|
| **Compartir tareas** | Compartir tareas y listas con otros usuarios | 📋 Evaluación | v2.1.0 |
| **Exportación de datos** | Exportar tareas y estadísticas en PDF, CSV o Excel | 📋 Evaluación | v2.1.0 |
| **Modo colaborativo** | Crear equipos y asignar tareas a múltiples usuarios | 📋 Evaluación | v3.0.0 |
| **Integración con calendarios externos** | Sincronizar con Google Calendar, Outlook u otros servicios | 📋 Evaluación | v3.0.0 |
| **Asistente por voz** | Crear y gestionar tareas mediante comandos de voz | 📋 Evaluación | v3.1.0 |

---

# 👥 Equipo de Desarrollo

El desarrollo de **TaskSync Pro** fue realizado de manera colaborativa por los siguientes integrantes:

| Integrante | Rol | Actividades realizadas |
|------------|-----|------------------------|
| **Carlos Isaac Fosado Escudero** | Desarrollador Frontend Mobile | Desarrollo de la interfaz móvil con React Native, implementación del sistema de autenticación (registro e inicio de sesión), persistencia de sesión, gestión de tareas, categorías, calendario, dashboard, perfil de usuario, almacenamiento independiente por usuario mediante AsyncStorage y documentación técnica del proyecto. |
| **Diego Salvador Tecorralco Martínez** | Líder del Proyecto / Desarrollador Backend | Planeación del proyecto, definición de la arquitectura del sistema, coordinación del equipo, integración de servicios, diseño de la estructura del proyecto, apoyo en el desarrollo del backend y elaboración de la documentación general. |


