# Requisitos de Negocio (BRs) - TaskSync Pro

## 1. Descripción General
TaskSync Pro es una plataforma de gestión de tareas y recordatorios diseñada para ayudar a los usuarios a organizar su tiempo, priorizar actividades y mejorar su productividad personal y profesional. La plataforma permite crear, editar, eliminar y organizar tareas con categorías, recurrencias y recordatorios automáticos.

## 2. Objetivos del Negocio
- Proporcionar una herramienta centralizada para la gestión de tareas diarias.
- Mejorar la productividad de los usuarios mediante recordatorios oportunos.
- Ofrecer una experiencia multi-dispositivo con sincronización en tiempo real.
- Facilitar la organización de tareas mediante categorías y recurrencias.

## 3. Usuarios del Sistema
- **Usuarios finales:** Personas que utilizan la plataforma para gestionar sus tareas personales y profesionales.
- **Administradores:** (Futuro) Personal encargado de gestionar la plataforma, usuarios y configuraciones globales.

## 4. Necesidades del Negocio
- **BR-01:** El sistema debe permitir a los usuarios registrar una cuenta de manera segura.
- **BR-02:** El sistema debe permitir a los usuarios iniciar sesión con sus credenciales.
- **BR-03:** El sistema debe permitir a los usuarios crear, leer, actualizar y eliminar tareas.
- **BR-04:** El sistema debe permitir a los usuarios organizar tareas por categorías predefinidas.
- **BR-05:** El sistema debe permitir a los usuarios establecer recordatorios para sus tareas.
- **BR-06:** El sistema debe permitir a los usuarios configurar recurrencias para tareas repetitivas.
- **BR-07:** El sistema debe enviar notificaciones automáticas cuando una tarea esté próxima a su fecha límite.
- **BR-08:** El sistema debe permitir a los usuarios marcar tareas como completadas o pendientes.
- **BR-09:** El sistema debe sincronizar los datos en tiempo real entre múltiples dispositivos.
- **BR-10:** El sistema debe ser accesible desde un navegador web.

## 5. Reglas de Negocio
- **RBN-01:** Un usuario solo puede ver y modificar sus propias tareas.
- **RBN-02:** Los recordatorios se activan automáticamente cuando la fecha de la tarea es igual o anterior a la fecha actual.
- **RBN-03:** Las recurrencias permiten repetir tareas diaria, semanal, mensual o por horas.
- **RBN-04:** Las categorías son predefinidas y no pueden ser creadas por los usuarios (inicialmente).
- **RBN-05:** La fecha de creación de una tarea se genera automáticamente.

## 6. Stakeholders
- Usuarios finales.
- Desarrolladores del sistema.
- Equipo de QA (Calidad).
- Administradores del sistema (futuro).