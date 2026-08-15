# UH-ML-001: Historias de Usuario - Sistema ML

## Historias de Usuario Mobile

### HU-ML-MOBILE-001: Clasificación de Prioridad
**Como** usuario de TaskSync Pro  
**Quiero** que el sistema clasifique automáticamente la prioridad de mis tareas  
**Para** poder enfocarme en lo más importante primero  

**Criterios de Aceptación:**
- [ ] El sistema acepta 5 características de entrada via sliders
- [ ] Devuelve clasificación (baja, media, alta, crítica)
- [ ] Muestra nivel de confianza
- [ ] Respuesta en menos de 500ms
- [ ] Guarda historial de predicciones
- [ ] Interfaz intuitiva y colorida

---

### HU-ML-MOBILE-002: Dashboard de Productividad
**Como** usuario de TaskSync Pro  
**Quiero** ver un dashboard con mis patrones de productividad  
**Para** entender mis hábitos y mejorarlos  

**Criterios de Aceptación:**
- [ ] Muestra distribución de tareas por prioridad
- [ ] Gráfica de productividad diaria
- [ ] Sugerencias personalizadas
- [ ] Actualización en tiempo real
- [ ] Accesible desde la app móvil

---

### HU-ML-MOBILE-003: Segmentación de Usuario
**Como** usuario de TaskSync Pro  
**Quiero** saber en qué cluster de productividad estoy  
**Para** entender mi estilo de trabajo  

**Criterios de Aceptación:**
- [ ] Mostrar cluster actual (Power, Balanced, Casual)
- [ ] Descripción del perfil
- [ ] Estadísticas de uso
- [ ] Comparativa con otros clusters
- [ ] Sugerencias de mejora

---

### HU-ML-MOBILE-004: Alertas Inteligentes
**Como** usuario de TaskSync Pro  
**Quiero** recibir alertas cuando estoy sobrecargado  
**Para** redistribuir mi carga de trabajo  

**Criterios de Aceptación:**
- [ ] Alerta cuando >5 tareas críticas
- [ ] Sugerencia de delegación
- [ ] Recomendación de re-programación
- [ ] Mensaje personalizado
- [ ] Opción de ignorar alerta

---

## Historias de Usuario Wearable

### HU-ML-WEARABLE-001: Predicción Rápida
**Como** usuario de smartwatch  
**Quiero** predecir prioridad de tareas desde mi reloj  
**Para** tomar decisiones rápidas sin usar el teléfono  

**Criterios de Aceptación:**
- [ ] Input simplificado (3 campos)
- [ ] Respuesta en menos de 300ms
- [ ] Notificación haptica
- [ ] Optimizado para pantalla pequeña
- [ ] Bajo consumo de batería

---

### HU-ML-WEARABLE-002: Resumen de Día
**Como** usuario de smartwatch  
**Quiero** ver un resumen de mis tareas del día  
**Para** planificar rápidamente  

**Criterios de Aceptación:**
- [ ] Mostrar cantidad de tareas por prioridad
- [ ] Productividad del día
- [ ] Cluster actual
- [ ] Actualización automática
- [ ] Interacción mínima

---

### HU-ML-WEARABLE-003: Alertas en Reloj
**Como** usuario de smartwatch  
**Quiero** recibir alertas de tareas críticas en mi reloj  
**Para** no perderme nada importante  

**Criterios de Aceptación:**
- [ ] Notificación push con vibración
- [ ] Título de la tarea
- [ ] Nivel de prioridad
- [ ] Tiempo restante
- [ ] Acción rápida (ver/ignorar)

---

### HU-ML-WEARABLE-004: Sugerencias de Productividad
**Como** usuario de smartwatch  
**Quiero** recibir sugerencias para mejorar mi productividad  
**Para** optimizar mi tiempo  

**Criterios de Aceptación:**
- [ ] Sugerencia de descanso cuando baja productividad
- [ ] Recordatorio de tareas pendientes
- [ ] Consejos personalizados
- [ ] Frecuencia adecuada
- [ ] No intrusivo

---

## Historias de Administrador

### HU-ML-ADMIN-001: Monitoreo de Modelos
**Como** administrador del sistema  
**Quiero** monitorear el rendimiento de los modelos ML  
**Para** asegurar la calidad del servicio  

**Criterios de Aceptación:**
- [ ] Dashboard con métricas de modelos
- [ ] Alertas de degradación
- [ ] Historial de rendimiento
- [ ] Logs de inferencias
- [ ] Exportación de reportes

---

### HU-ML-ADMIN-002: Reentrenamiento
**Como** administrador del sistema  
**Quiero** reentrenar los modelos automáticamente  
**Para** mantener la precisión actualizada  

**Criterios de Aceptación:**
- [ ] Reentrenamiento automático programado
- [ ] Validación post-entrenamiento
- [ ] Rollback automático si falla
- [ ] Notificación de resultados
- [ ] Logs detallados

---

## Criterios de Aceptación Generales

| **Criterio** | **Mobile** | **Wearable** |
|--------------|------------|--------------|
| Tiempo de respuesta | < 500ms | < 300ms |
| Precisión | > 85% | > 80% |
| Disponibilidad | 99.9% | 99.5% |
| UX/UI | Colorida e intuitiva | Minimalista |
| Feedback | Visual y haptico | Haptico |
| Offline | Datos cacheados | Datos cacheados |