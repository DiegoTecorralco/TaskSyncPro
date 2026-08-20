# Requisitos No Funcionales (NFRs) - TaskSync Pro

## 1. Usabilidad
- **NFR-01:** La API debe responder con mensajes de error claros y estandarizados en formato JSON.
- **NFR-02:** La documentación de la API debe estar disponible y ser comprensible para desarrolladores.

## 2. Rendimiento
- **NFR-03:** El tiempo de respuesta de la API debe ser inferior a 500 ms para el 95% de las peticiones.
- **NFR-04:** El sistema debe manejar al menos 1000 conexiones concurrentes.
- **NFR-05:** Las notificaciones en tiempo real deben entregarse en menos de 2 segundos.

## 3. Seguridad
- **NFR-06:** Todas las contraseñas deben almacenarse encriptadas con bcrypt.
- **NFR-07:** Todas las rutas protegidas deben validar el token JWT.
- **NFR-08:** El sistema debe utilizar HTTPS en entornos de producción.
- **NFR-09:** Las variables de entorno (credenciales, secretos) no deben estar expuestas en el código fuente.
- **NFR-10:** La API debe implementar CORS configurado para dominios específicos en producción.

## 4. Disponibilidad y Confiabilidad
- **NFR-11:** El sistema debe tener una disponibilidad del 99.9% (tiempo de inactividad máximo de 8.76 horas al año).
- **NFR-12:** El sistema debe manejar errores de conexión a la base de datos con reintentos automáticos.
- **NFR-13:** El sistema debe ser capaz de recuperarse automáticamente después de un fallo.

## 5. Mantenibilidad
- **NFR-14:** El código debe seguir las convenciones de estilo de JavaScript/Node.js.
- **NFR-15:** El código debe estar documentado con comentarios claros.
- **NFR-16:** La arquitectura debe estar separada por capas (rutas, controladores, servicios, DAO).
- **NFR-17:** El sistema debe utilizar variables de entorno para todas las configuraciones sensibles.
- **NFR-18:** El sistema debe ser fácilmente desplegable mediante Docker.

## 6. Portabilidad
- **NFR-19:** El sistema debe ejecutarse en Windows, Linux y macOS.
- **NFR-20:** El sistema debe ser compatible con MySQL 8.0 o superior.

## 7. Escalabilidad
- **NFR-21:** La arquitectura debe permitir escalar horizontalmente añadiendo más instancias de la API.
- **NFR-22:** El sistema debe manejar el crecimiento de la base de datos sin degradación del rendimiento.

## 8. Tecnologías y Dependencias
- **Backend:** Node.js v20+ con Express.js.
- **Base de Datos:** MySQL 8.0+.
- **Autenticación:** JWT (JSON Web Tokens) + bcrypt.
- **Tiempo Real:** Socket.IO.
- **Programación de Tareas:** node-cron.
- **Contenerización:** Docker + Docker Compose.