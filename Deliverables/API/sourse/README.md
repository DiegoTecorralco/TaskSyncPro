# sourse
#  TASKSYNC PRO API - README

##  DESCRIPCIÓN GENERAL

TaskSync Pro API es una API RESTful para la gestión de tareas y recordatorios con sincronización multi-dispositivo. Permite a los usuarios crear, organizar y gestionar sus tareas con categorías y recurrencias, incluyendo notificaciones automáticas.

##  TECNOLOGÍAS UTILIZADAS

- Node.js v24.14.1+
- Express 4.18.2
- MySQL 8.0+
- mysql2 3.6.0
- JSON Web Token 9.0.2
- Bcrypt 5.1.1
- node-cron 3.0.2
- Helmet 7.0.0
- CORS 2.8.5
- Morgan 1.10.0
- Compression 1.7.4
- Cookie-parser 1.4.6

##  ESTRUCTURA DEL PROYECTO

TaskSyncPro/
└── Deliverables/
    └── API/
        └── sourse/
            ├── app.js
            ├── package.json
            ├── .env
            ├── config/
            │   ├── env.js
            │   └── database.js
            ├── controllers/
            │   ├── auth.controller.js
            │   ├── user.controller.js
            │   ├── task.controller.js
            │   ├── category.controller.js
            │   ├── reminder.controller.js
            │   └── recurrence.controller.js
            ├── services/
            │   ├── task.service.js
            │   ├── reminder.service.js
            │   ├── recurrence.service.js
            │   └── sync.service.js
            ├── routes/
            │   ├── auth.routes.js
            │   ├── user.routes.js
            │   ├── task.routes.js
            │   ├── category.routes.js
            │   ├── reminder.routes.js
            │   └── recurrence.routes.js
            ├── middleware/
            │   ├── auth.middleware.js
            │   └── validation.middleware.js
            ├── utils/
            │   ├── jwt.js
            │   └── password.js
            ├── DAO/
            │   ├── user.dao.js
            │   ├── reminder.dao.js
            │   ├── category.dao.js
            │   └── recurrence.dao.js
            └── cron/
                └── reminder.cron.js

##  BASE DE DATOS

### SCRIPT DE CREACIÓN DE TABLAS

```sql
-- 1. Tabla Usuarios
CREATE TABLE usuarios (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabla Categorías
CREATE TABLE categorias (
    categoria_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- 3. Tabla Recordatorios
CREATE TABLE recordatorios (
    recordatorio_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    categoria_id INT,
    título VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notificado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha),
    INDEX idx_notificado (notificado)
);

-- 4. Tabla Recurrencias
CREATE TABLE recurrencias (
    recurrencia_id INT PRIMARY KEY AUTO_INCREMENT,
    recordatorio_id INT NOT NULL,
    tipo ENUM('diario', 'semanal', 'mensual', 'horario') NOT NULL,
    intervalo INT DEFAULT 1,
    FOREIGN KEY (recordatorio_id) REFERENCES recordatorios(recordatorio_id) ON DELETE CASCADE,
    INDEX idx_recordatorio (recordatorio_id)
);

-- 5. Tabla Historial de Estados
CREATE TABLE historial_estados (
    estado_id INT PRIMARY KEY AUTO_INCREMENT,
    recordatorio_id INT NOT NULL,
    cambio TEXT NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recordatorio_id) REFERENCES recordatorios(recordatorio_id) ON DELETE CASCADE,
    INDEX idx_recordatorio (recordatorio_id)
);
```

### DATOS INICIALES (CATEGORÍAS)

```sql
INSERT INTO categorias (nombre) VALUES 
    ('Trabajo'),
    ('Personal'),
    ('Estudio'),
    ('Salud'),
    ('Finanzas'),
    ('Familia'),
    ('Social'),
    ('Otros');
```

## 🔧 INSTALACIÓN Y CONFIGURACIÓN

### 1. INSTALAR DEPENDENCIAS

```bash
npm install
```

### 2. CONFIGURAR VARIABLES DE ENTORNO

Crear archivo .env en la raíz:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tasksync_db
DB_USER=root
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro
JWT_EXPIRES_IN=7d
```

### 3. CREAR LA BASE DE DATOS

```sql
CREATE DATABASE tasksync_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. EJECUTAR EL SCRIPT SQL

Ejecuta el script de creación de tablas proporcionado arriba.

### 5. INSERTAR CATEGORÍAS INICIALES

Ejecuta el script de inserción de categorías.

### 6. INICIAR EL SERVIDOR

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

##  ENDPOINTS DE LA API

### AUTENTICACIÓN (AUTH)

POST /api/auth/register - Registrar nuevo usuario
POST /api/auth/login - Iniciar sesión

### USUARIOS (USERS)

GET /api/users - Obtener todos los usuarios
GET /api/users/:id - Obtener usuario por ID
POST /api/users - Crear usuario
PUT /api/users/:id - Actualizar usuario
DELETE /api/users/:id - Eliminar usuario

### CATEGORÍAS (CATEGORIES)

GET /api/categories - Obtener todas las categorías
GET /api/categories/:id - Obtener categoría por ID
POST /api/categories - Crear categoría
PUT /api/categories/:id - Actualizar categoría
DELETE /api/categories/:id - Eliminar categoría

### RECORDATORIOS (REMINDERS)

GET /api/reminders - Obtener todos los recordatorios
GET /api/reminders/:id - Obtener recordatorio por ID
GET /api/reminders/user/:userId - Obtener recordatorios por usuario
POST /api/reminders - Crear recordatorio
PUT /api/reminders/:id - Actualizar recordatorio
DELETE /api/reminders/:id - Eliminar recordatorio
PATCH /api/reminders/:id/notify - Marcar como notificado

### TAREAS (TASKS - DASHBOARD)

GET /api/tasks/dashboard/:userId - Dashboard de tareas
GET /api/tasks/pending/:userId - Tareas pendientes
GET /api/tasks/completed/:userId - Tareas completadas

### RECURRENCIAS (RECURRENCES)

GET /api/recurrences - Obtener todas las recurrencias
GET /api/recurrences/:id - Obtener recurrencia por ID
GET /api/recurrences/reminder/:reminderId - Obtener recurrencias por recordatorio
POST /api/recurrences - Crear recurrencia
PUT /api/recurrences/:id - Actualizar recurrencia
DELETE /api/recurrences/:id - Eliminar recurrencia

### RUTA PRINCIPAL

GET / - Información de la API

## EJEMPLOS DE PETICIONES

### REGISTRAR USUARIO

POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
    "nombre": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "García",
    "correo": "juan@email.com",
    "password": "123456"
}

### INICIAR SESIÓN

POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "correo": "juan@email.com",
    "password": "123456"
}

### CREAR RECORDATORIO (FECHA AUTOMÁTICA)

POST http://localhost:3000/api/reminders
Authorization: Bearer TU_TOKEN
Content-Type: application/json

{
    "usuario_id": 1,
    "categoria_id": 1,
    "titulo": "Reunión importante",
    "descripcion": "Reunión con el equipo de desarrollo"
}

### CREAR RECURRENCIA

POST http://localhost:3000/api/recurrences
Authorization: Bearer TU_TOKEN
Content-Type: application/json

{
    "recordatorio_id": 1,
    "tipo": "diario",
    "intervalo": 1
}

##  RESPUESTAS DE LA API

### RESPUESTA EXITOSA

{
    "success": true,
    "message": "Mensaje descriptivo",
    "data": {
        // Datos de la respuesta
    }
}

### RESPUESTA DE ERROR

{
    "success": false,
    "message": "Mensaje de error",
    "error": "Detalle del error"
}

### RESPUESTA DE VALIDACIÓN

{
    "success": false,
    "message": "Errores de validación",
    "errors": [
        {
            "msg": "El correo debe ser válido",
            "param": "correo",
            "location": "body"
        }
    ]
}

##  AUTENTICACIÓN

La API utiliza JWT (JSON Web Tokens) para autenticación.

### OBTENER TOKEN

1. Registrar usuario o iniciar sesión
2. El servidor devuelve un token JWT
3. Incluir el token en todas las peticiones protegidas

### HEADER DE AUTENTICACIÓN

Authorization: Bearer TU_TOKEN_AQUI

##  DEPENDENCIAS

```json
{
    "dependencies": {
    "bcrypt": "^6.0.0",
    "compression": "^1.8.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-validator": "^7.3.2",
    "helmet": "^8.2.0",
    "jsonwebtoken": "^9.0.3",
    "morgan": "^1.11.0",
    "mysql2": "^3.22.6",
    "node-cron": "^4.5.0",
    "sequelize": "^6.37.8",
    "uuid": "^14.0.1"
  },
    "devDependencies": {
        "nodemon": "^3.0.1"
    }
}
```

##  SCRIPTS DISPONIBLES

```bash
# Iniciar en modo desarrollo
npm run dev

# Iniciar en modo producción
npm start

# Instalar dependencias
npm install
```

##  VARIABLES DE ENTORNO

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| PORT | Puerto del servidor | 3000 |
| NODE_ENV | Entorno de ejecución | development |
| DB_HOST | Host de la base de datos | localhost |
| DB_PORT | Puerto de la base de datos | 3306 |
| DB_NAME | Nombre de la base de datos | tasksyncpro |
| DB_USER | Usuario de la base de datos | root |
| DB_PASSWORD | Contraseña de la base de datos | - |
| JWT_SECRET | Secreto para JWT | - |
| JWT_EXPIRES_IN | Expiración del token | 7d |

##  DIAGRAMA DE BASE DE DATOS

```
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│    Usuarios     │     │   Recordatorios     │     │   Recurrencias     │
├─────────────────┤     ├─────────────────────┤     ├─────────────────────┤
│ usuario_id (PK) │◄────│ usuario_id (FK)     │     │ recurrencia_id (PK)│
│ nombre          │     │ recordatorio_id (PK)│◄────│ recordatorio_id (FK)│
│ apellido_paterno│     │ categoria_id (FK)   │     │ tipo (ENUM)         │
│ apellido_materno│     │ título              │     │ intervalo           │
│ correo          │     │ descripcion         │     └─────────────────────┘
│ password        │     │ fecha               │
│ fecha_registro  │     │ notificado          │     ┌─────────────────────┐
│ fecha_actualiz. │     │ fecha_creacion      │     │   Categorías        │
└─────────────────┘     └─────────────────────┘     ├─────────────────────┤
                                │                    │ categoria_id (PK)   │
                                │                    │ nombre              │
                                ▼                    └─────────────────────┘
                       ┌─────────────────────┐
                       │ Historial_Estados   │
                       ├─────────────────────┤
                       │ estado_id (PK)      │
                       │ recordatorio_id (FK)│
                       │ cambio              │
                       │ fecha_cambio        │
                       └─────────────────────┘
```

##  CARACTERÍSTICAS PRINCIPALES

- ✅ Autenticación JWT
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Fechas automáticas en recordatorios
- ✅ Notificaciones programadas con cron
- ✅ Sincronización multi-dispositivo
- ✅ Categorías predefinidas
- ✅ Recurrencias de tareas
- ✅ Dashboard de tareas (pendientes/completadas)
- ✅ Validación de datos
- ✅ Manejo global de errores
- ✅ Logging con Morgan
- ✅ Seguridad con Helmet
- ✅ Compresión de respuestas
- ✅ CORS habilitado



##  AUTOR

DIEGO TECORRALCO
