# UR-ML-001: Requerimientos de Usuario - Sistema ML

## 1. Perfiles de Usuario

### Usuario Mobile
- **Necesidad**: Gestionar tareas eficientemente
- **Expectativa**: Clasificación automática y precisa
- **Frecuencia**: Uso diario (3-5 veces/día)
- **Dispositivo**: Smartphone (iOS/Android)
- **Contexto**: Movilidad, multitarea

### Usuario Wearable
- **Necesidad**: Acceso rápido a información
- **Expectativa**: Predicciones inmediatas
- **Frecuencia**: Uso frecuente (cada 2-3 horas)
- **Dispositivo**: Smartwatch (Apple Watch/Wear OS)
- **Contexto**: Manos libres, discreción

### Administrador
- **Necesidad**: Monitoreo del sistema
- **Expectativa**: Dashboard con métricas claras
- **Frecuencia**: Uso diario/semanal
- **Dispositivo**: Web/Mobile
- **Contexto**: Gestión y control

## 2. Requerimientos por Perfil

### Usuario Mobile

| **Requerimiento** | **Prioridad** | **Descripción** |
|------------------|---------------|-----------------|
| R-UR-MOB-001 | Alta | Clasificar prioridad de tareas |
| R-UR-MOB-002 | Alta | Ver dashboard de productividad |
| R-UR-MOB-003 | Media | Conocer mi cluster de usuario |
| R-UR-MOB-004 | Media | Recibir alertas inteligentes |
| R-UR-MOB-005 | Baja | Ver historial de predicciones |
| R-UR-MOB-006 | Baja | Personalizar preferencias |

### Usuario Wearable

| **Requerimiento** | **Prioridad** | **Descripción** |
|------------------|---------------|-----------------|
| R-UR-WEA-001 | Alta | Predicción rápida (3 inputs) |
| R-UR-WEA-002 | Alta | Resumen de tareas del día |
| R-UR-WEA-003 | Alta | Alertas de tareas críticas |
| R-UR-WEA-004 | Media | Sugerencias de productividad |
| R-UR-WEA-005 | Baja | Sincronización con mobile |

### Administrador

| **Requerimiento** | **Prioridad** | **Descripción** |
|------------------|---------------|-----------------|
| R-UR-ADM-001 | Alta | Monitoreo de modelos |
| R-UR-ADM-002 | Alta | Gestión de reentrenamiento |
| R-UR-ADM-003 | Media | Visualización de logs |
| R-UR-ADM-004 | Media | Reportes de rendimiento |
| R-UR-ADM-005 | Baja | Configuración avanzada |

## 3. Flujos de Usuario

### Flujo Principal (Mobile)
1. Usuario abre la app
2. Ve dashboard con resumen
3. Selecciona "Nueva Predicción"
4. Ajusta sliders con características
5. Obtiene clasificación de prioridad
6. Decide acción basada en resultado

### Flujo Alternativo (Mobile)
1. Recibe notificación push de alerta
2. Abre app desde notificación
3. Ve tarea crítica
4. Toma acción inmediata

### Flujo Principal (Wearable)
1. Usuario abre app en smartwatch
2. Ve resumen del día
3. Selecciona "Predicción"
4. Elige valores rápidos (bajo, medio, alto)
5. Obtiene resultado con vibración
6. Actúa según recomendación

## 4. Criterios de Éxito por Usuario

### Usuario Mobile
- ✅ 80% de tareas tienen prioridad asignada
- ✅ Reducción del 20% en tiempo de organización
- ✅ 70% de usuarios usa predicción semanalmente

### Usuario Wearable
- ✅ 60% de usuarios usa predicción diariamente
- ✅ 50% de acciones tomadas desde wearable
- ✅ Reducción del 30% en tareas olvidadas

### Administrador
- ✅ 99.9% de uptime del servicio
- ✅ Precisión de modelos >85%
- ✅ Alertas de degradación en <5min

## 5. Interacciones con el Sistema

### Entradas de Usuario

| **Tipo** | **Mobile** | **Wearable** | **Descripción** |
|----------|------------|--------------|-----------------|
| Sliders | ✅ 5 campos | ❌ | Ajuste fino de características |
| Botones | ✅ | ✅ | Selección rápida de valores |
| Voz | ⚠️ Opcional | ⚠️ | Comando por voz |
| Toque | ✅ | ✅ | Navegación táctil |
| Haptico | ⚠️ | ✅ | Retroalimentación táctil |

### Salidas del Sistema

| **Tipo** | **Mobile** | **Wearable** | **Descripción** |
|----------|------------|--------------|-----------------|
| Visual | ✅ | ✅ | Texto y gráficas |
| Notificación | ✅ | ✅ | Push notification |
| Haptico | ⚠️ | ✅ | Vibración |
| Audio | ⚠️ | ❌ | Sonido de alerta |
| Widget | ✅ | ✅ | Vista rápida |

## 6. Requerimientos de UX

### Mobile UX
| **Requerimiento** | **Especificación** |
|------------------|-------------------|
| Navegación | Bottom tabs (4 secciones) |
| Feedback | Animaciones y colores |
| Carga | Spinners y skeleton |
| Error | Mensajes claros y acciones |
| Accesibilidad | Texto redimensionable |

### Wearable UX
| **Requerimiento** | **Especificación** |
|------------------|-------------------|
| Navegación | Scroll vertical simple |
| Feedback | Vibración y colores |
| Carga | Indicador rápido |
| Error | Mensaje breve y claro |
| Accesibilidad | Contraste alto |

## 7. Requerimientos de Rendimiento

### Mobile
| **Métrica** | **Objetivo** | **Tolerancia** |
|-------------|--------------|----------------|
| Primera carga | < 2s | < 3s |
| Predicción | < 500ms | < 800ms |
| Actualización | < 300ms | < 500ms |
| Consumo datos | < 5MB/día | < 10MB/día |

### Wearable
| **Métrica** | **Objetivo** | **Tolerancia** |
|-------------|--------------|----------------|
| Primera carga | < 1s | < 1.5s |
| Predicción | < 300ms | < 500ms |
| Actualización | < 200ms | < 300ms |
| Consumo batería | < 5%/día | < 10%/día |