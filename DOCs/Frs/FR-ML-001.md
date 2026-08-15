# FR-ML-001: Requerimientos Funcionales - Sistema ML

## 1. Módulo de Modelos Supervisados

### FR-ML-001.1: Clasificación de Prioridad de Tareas
- **Descripción**: El sistema debe clasificar automáticamente la prioridad de una tarea
- **Entradas**: 
  - priority_score (0-1): Puntuación de prioridad
  - urgency_score (0-1): Puntuación de urgencia
  - complexity_score (0-1): Puntuación de complejidad
  - time_available (0-1): Tiempo disponible
  - energy_level (0-1): Nivel de energía
- **Salida**: 
  - prediction: low, medium, high, critical
  - confidence: Nivel de confianza (0-1)
  - class_probabilities: Probabilidades por clase
- **Endpoint**: POST /api/ml/supervised/predict
- **Mobile UI**: Formulario con sliders
- **Wearable UI**: Input simplificado (3 campos)

### FR-ML-001.2: Predicción de Abandono de Usuario
- **Descripción**: Identificar usuarios en riesgo de abandonar la plataforma
- **Entradas**: 
  - avg_tasks_per_day: Promedio de tareas diarias
  - completion_rate: Tasa de completado (0-1)
  - avg_time_spent: Tiempo promedio en app (horas)
  - active_days_per_week: Días activos por semana
  - session_frequency: Frecuencia de sesiones
- **Salida**: 
  - risk_score: Puntuación de riesgo (0-1)
  - churn_probability: Probabilidad de abandono
  - recommendations: Recomendaciones
- **Endpoint**: POST /api/ml/supervised/churn-prediction

### FR-ML-001.3: Predicción Ligera para Wearable
- **Descripción**: Versión optimizada para dispositivos wearable
- **Entradas**: priority, urgency, complexity (3 campos)
- **Salida**: 
  - prediction: low, medium, high
  - confidence: Nivel de confianza
- **Endpoint**: POST /api/ml/supervised/predict-light
- **Optimización**: 
  - Menos datos de entrada
  - Respuesta más rápida
  - Menor consumo de batería

## 2. Módulo de Modelos No Supervisados

### FR-ML-002.1: Segmentación de Usuarios
- **Descripción**: Agrupar usuarios por patrones de comportamiento
- **Entradas**: 
  - avg_tasks_per_day: Promedio de tareas diarias
  - completion_rate: Tasa de completado
  - avg_time_spent: Tiempo promedio
  - active_days_per_week: Días activos
- **Salida**: 
  - cluster: Número de cluster (0-2)
  - segment: casual_worker, power_user, balanced_professional
  - interpretation: Descripción del perfil
- **Endpoint**: POST /api/ml/unsupervised/segment

### FR-ML-002.2: Reducción de Dimensionalidad
- **Descripción**: Reducir características para visualización
- **Entradas**: Vector multidimensional
- **Salida**: Coordenadas 2D (pca_1, pca_2)
- **Endpoint**: POST /api/ml/unsupervised/reduce
- **Mobile UI**: Gráfico de dispersión interactivo
- **Wearable UI**: Indicador de cluster simplificado

## 3. Módulo de Dashboard en Tiempo Real

### FR-ML-003.1: Dashboard Mobile
- **Descripción**: Panel de control en app móvil
- **Componentes**:
  - Resumen de prioridades
  - Predicción rápida
  - Perfil de usuario (cluster)
  - Gráfica de productividad
  - Alertas inteligentes
- **Actualización**: Socket.IO en tiempo real

### FR-ML-003.2: Dashboard Wearable
- **Descripción**: Visualización optimizada para smartwatch
- **Componentes**:
  - Prioridad de tarea actual
  - Productividad del día
  - Cluster de usuario
  - Alertas breves
- **Actualización**: Push notifications

### FR-ML-003.3: Historial de Predicciones
- **Descripción**: Almacenar y recuperar historial de inferencias
- **Endpoint**: GET /api/ml/inferences
- **Almacenamiento**: Últimas 1000 predicciones
- **Filtros**: Por tipo (supervised/unsupervised/light)

## 4. Módulo de Administración

### FR-ML-004.1: Estado de Modelos
- **Descripción**: Ver estado y métricas de modelos
- **Endpoint**: GET /api/ml/models
- **Información**:
  - Tipo de modelo
  - Último entrenamiento
  - Métricas de rendimiento
  - Versión

### FR-ML-004.2: Reentrenamiento de Modelos
- **Descripción**: Reentrenar modelos con nuevos datos
- **Endpoint**: POST /api/ml/models/:type/retrain
- **Tipos**: supervised, unsupervised
- **Validación**: Automática post-entrenamiento
- **Rollback**: Si falla, vuelve a versión anterior

### FR-ML-004.3: Health Check
- **Descripción**: Verificar estado del servicio ML
- **Endpoint**: GET /api/ml/health
- **Verifica**:
  - Conexión a servicios
  - Modelos cargados
  - Rendimiento
  - Errores recientes