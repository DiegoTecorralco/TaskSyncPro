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

Cada usuario registrado obtiene un identificador único.

---

### 🔑 Inicio de sesión

Los usuarios pueden iniciar sesión utilizando:

- Correo electrónico.
- Contraseña.

El sistema busca las credenciales en los usuarios almacenados localmente.

Si las credenciales son correctas, se crea una sesión y el usuario es enviado a la pantalla principal.

Si las credenciales son incorrectas, se muestra un mensaje de error.

---

### 💾 Persistencia de sesión

La sesión del usuario se almacena con AsyncStorage.

Esto permite que, al cerrar y volver a abrir la aplicación, el usuario permanezca autenticado sin tener que introducir nuevamente sus datos.

# 👥 Equipo de Desarrollo

El desarrollo de **TaskSync Pro** fue realizado de manera colaborativa por los siguientes integrantes:

| Integrante | Rol | Actividades realizadas |
|------------|-----|------------------------|
| **Carlos Isaac Fosado Escudero** | Desarrollador Frontend Mobile | Desarrollo de la interfaz móvil con React Native, implementación del sistema de autenticación (registro e inicio de sesión), persistencia de sesión, gestión de tareas, categorías, calendario, dashboard, perfil de usuario, almacenamiento independiente por usuario mediante AsyncStorage y documentación técnica del proyecto. |
| **Diego Salvador Tecorralco Martínez** | Líder del Proyecto / Desarrollador Backend | Planeación del proyecto, definición de la arquitectura del sistema, coordinación del equipo, integración de servicios, diseño de la estructura del proyecto, apoyo en el desarrollo del backend y elaboración de la documentación general. |


