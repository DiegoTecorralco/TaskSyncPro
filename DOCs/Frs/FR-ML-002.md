# FR-ML-002: Requerimientos Funcionales - Integración Frontend

## 1. Integración con Mobile App (React Native / Flutter)

### FR-ML-002.1: Pantalla Principal ML
- **Descripción**: Dashboard con información ML
- **Componentes**:
  - Header con estado del sistema
  - Resumen de prioridades del día
  - Predicción rápida con slider
  - Perfil de usuario con cluster
  - Gráfico de tendencias
- **Navegación**: Acceso a pantallas de predicción y análisis

### FR-ML-002.2: Pantalla de Predicción
- **Descripción**: Formulario para nueva predicción
- **Inputs**: 5 sliders interactivos
- **Resultado**: Tarjeta con prioridad y confianza
- **Acciones**: Guardar, compartir, crear tarea

### FR-ML-002.3: Pantalla de Análisis
- **Descripción**: Visualización de datos ML
- **Componentes**:
  - Gráfica de distribución de prioridades
  - Visualización de clusters
  - Tendencias de productividad
  - Alertas inteligentes

### FR-ML-002.4: Notificaciones Push
- **Descripción**: Alertas basadas en ML
- **Tipos**:
  - Tarea crítica próxima
  - Baja productividad detectada
  - Sugerencia de mejora
  - Cambio de cluster

## 2. Integración con Wearable App

### FR-ML-002.5: Pantalla Principal Wearable
- **Descripción**: Vista optimizada para smartwatch
- **Componentes**:
  - Prioridad de tarea actual
  - Productividad del día (barra)
  - Cluster de usuario
  - Contador de alertas

### FR-ML-002.6: Predicción desde Wearable
- **Descripción**: Input simplificado con 3 campos
- **Interacción**: Selección rápida con botones
- **Resultado**: Notificación con prioridad

### FR-ML-002.7: Alertas en Wearable
- **Descripción**: Notificaciones hapticas
- **Tipos**:
  - Vibración por tarea crítica
  - Recordatorio de productividad
  - Sugerencia de acción

## 3. Socket.IO en Tiempo Real

### FR-ML-003.1: Eventos para Mobile
- **Descripción**: Actualizaciones en tiempo real
- **Eventos**:
  - `new_supervised_prediction`: Nueva predicción
  - `new_unsupervised_analysis`: Nuevo análisis
  - `model_performance_update`: Actualización de métricas
  - `system_alert`: Alertas del sistema

### FR-ML-003.2: Eventos para Wearable
- **Descripción**: Notificaciones ligeras
- **Eventos**:
  - `wearable_alert`: Alerta prioritaria
  - `cluster_update`: Cambio de cluster
  - `productivity_update`: Actualización de productividad

## 4. Seguridad y Autenticación

### FR-ML-004.1: Autenticación
- **Descripción**: Todos los endpoints protegidos con JWT
- **Header**: Authorization: Bearer <token>
- **Middleware**: authMiddleware

### FR-ML-004.2: Rate Limiting
- **Descripción**: Límite de peticiones para endpoints ML
- **Límite**: 100 peticiones por minuto
- **Mensaje**: "Demasiadas solicitudes"

### FR-ML-004.3: Validación de Entrada
- **Descripción**: Validar datos antes de procesar
- **Validaciones**:
  - Campos requeridos
  - Rangos de valores
  - Tipos de datos
  - Longitudes máximas