# Requisitos Funcionales (FRs) - TaskSync Pro

## 1. Módulo de Autenticación
- **FR-01:** El sistema debe permitir el registro de nuevos usuarios con nombre, apellidos, correo electrónico y contraseña.
- **FR-02:** El sistema debe encriptar las contraseñas utilizando bcrypt antes de almacenarlas en la base de datos.
- **FR-03:** El sistema debe permitir el inicio de sesión mediante correo electrónico y contraseña.
- **FR-04:** El sistema debe generar un token JWT válido por 7 días al iniciar sesión.
- **FR-05:** El sistema debe verificar el token JWT en todas las rutas protegidas.

## 2. Módulo de Usuarios
- **FR-06:** El sistema debe permitir obtener la lista de todos los usuarios (solo para administradores en el futuro).
- **FR-07:** El sistema debe permitir obtener la información de un usuario específico por su ID.
- **FR-08:** El sistema debe permitir actualizar la información de un usuario (nombre, apellidos, correo).
- **FR-09:** El sistema debe permitir eliminar un usuario y todas sus tareas asociadas.

## 3. Módulo de Tareas (Recordatorios)
- **FR-10:** El sistema debe permitir crear una nueva tarea con título, descripción, fecha y categoría.
- **FR-11:** El sistema debe permitir obtener todas las tareas de un usuario.
- **FR-12:** El sistema debe permitir obtener una tarea específica por su ID.
- **FR-13:** El sistema debe permitir actualizar una tarea (título, descripción, fecha, categoría, estado de notificación).
- **FR-14:** El sistema debe permitir eliminar una tarea.
- **FR-15:** El sistema debe permitir marcar una tarea como notificada.
- **FR-16:** El sistema debe permitir obtener tareas pendientes (no notificadas) de un usuario.
- **FR-17:** El sistema debe permitir obtener tareas completadas (notificadas) de un usuario.

## 4. Módulo de Categorías
- **FR-18:** El sistema debe permitir obtener todas las categorías predefinidas.
- **FR-19:** El sistema debe permitir obtener una categoría específica por su ID.
- **FR-20:** El sistema debe permitir crear nuevas categorías.
- **FR-21:** El sistema debe permitir actualizar el nombre de una categoría.
- **FR-22:** El sistema debe permitir eliminar una categoría.

## 5. Módulo de Recurrencias
- **FR-23:** El sistema debe permitir crear una recurrencia para una tarea con tipo (diario, semanal, mensual, horario) e intervalo.
- **FR-24:** El sistema debe permitir obtener todas las recurrencias.
- **FR-25:** El sistema debe permitir obtener una recurrencia específica por su ID.
- **FR-26:** El sistema debe permitir obtener las recurrencias asociadas a una tarea.
- **FR-27:** El sistema debe permitir actualizar una recurrencia.
- **FR-28:** El sistema debe permitir eliminar una recurrencia.

## 6. Módulo de Sincronización y Tiempo Real (Socket.IO)
- **FR-29:** El sistema debe permitir la conexión en tiempo real mediante Socket.IO.
- **FR-30:** El sistema debe autenticar las conexiones Socket.IO mediante JWT.
- **FR-31:** El sistema debe emitir eventos cuando se cree, actualice o elimine una tarea.
- **FR-32:** El sistema debe emitir alertas de recordatorios en tiempo real cuando una tarea esté vencida.

## 7. Módulo de Notificaciones Programadas (Cron)
- **FR-33:** El sistema debe ejecutar un proceso cron cada minuto para buscar tareas vencidas y no notificadas.
- **FR-34:** El sistema debe emitir notificaciones Socket.IO y marcar las tareas como notificadas automáticamente.