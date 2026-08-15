# NFR-ML-001: Requerimientos No Funcionales - Sistema ML

## 1. Rendimiento

| **Requerimiento** | **Especificación** | **Métrica** | **Mobile** | **Wearable** |
|------------------|-------------------|-------------|------------|--------------|
| Tiempo de respuesta | Predicciones | P95 < 500ms | P95 < 500ms | P95 < 300ms |
| Concurrencia | Soportar usuarios | 1000 req/seg | 500 req/seg | 100 req/seg |
| Latencia | Base de datos | P50 < 50ms | P50 < 50ms | P50 < 30ms |
| Throughput | Inferencias/min | 1000/min | 500/min | 100/min |
| Consumo batería | En wearable | N/A | N/A | < 5% / día |

## 2. Disponibilidad

| **Requerimiento** | **Especificación** | **Objetivo** |
|------------------|-------------------|--------------|
| Uptime | Disponibilidad del servicio | 99.9% |
| Tolerancia a fallos | Manejo de errores graceful | Recuperación < 5s |
| Health checks | Monitoreo continuo | Cada 30s |
| Offline mode | En wearable | Datos cacheados |

## 3. Escalabilidad

| **Requerimiento** | **Especificación** | **Solución** |
|------------------|-------------------|--------------|
| Horizontal | Escalar modelos | Containerización |
| Vertical | Optimización de recursos | Caching |
| Almacenamiento | Crecimiento de datos | Particionamiento |
| Wearable | Datos ligeros | Endpoints optimizados |

## 4. Seguridad

| **Requerimiento** | **Especificación** | **Implementación** |
|------------------|-------------------|-------------------|
| Autenticación | JWT para todos los endpoints | authMiddleware |
| Autorización | Control de acceso por rol | RBAC |
| Datos sensibles | Anonimización | Enmascaramiento |
| Logs | Audit trails | Logging estructurado |
| Mobile | Almacenamiento seguro | Encrypted storage |
| Wearable | Token renovable | Refresh tokens |

## 5. Mantenibilidad

| **Requerimiento** | **Especificación** | **Práctica** |
|------------------|-------------------|--------------|
| Código | Modular y documentado | ESLint, JSDoc |
| Tests | Cobertura > 80% | Jest, Supertest |
| Monitoreo | Métricas de negocio | Prometheus/Grafana |
| Debug | Logs estructurados | Winston |
| Versionado | Modelos versionados | SemVer |

## 6. Usabilidad

| **Requerimiento** | **Especificación** | **Métrica** |
|------------------|-------------------|-------------|
| Mobile | UI responsive | < 2s carga |
| Wearable | UI optimizada | < 1s interacción |
| Accesibilidad | WCAG 2.1 | Nivel AA |
| Feedback | Indicadores de carga | < 3s feedback |
| Wearable | Input simplificado | 3 campos máximo |

## 7. Compatibilidad

| **Requerimiento** | **Especificación** |
|------------------|-------------------|
| Mobile App | React Native / Flutter |
| Wearable App | WatchOS / Wear OS |
| Versión iOS | iOS 14+ |
| Versión Android | Android 10+ |
| WatchOS | WatchOS 7+ |
| Wear OS | Wear OS 3+ |

## 8. Rendimiento en Wearable

| **Requerimiento** | **Especificación** | **Límite** |
|------------------|-------------------|------------|
| Tamaño respuesta | Datos minimizados | < 1KB |
| Requests | Por sesión | < 10/ hora |
| Procesamiento | En dispositivo | < 100ms |
| Almacenamiento | Datos locales | < 5MB |
| Conexión | Wi-Fi / Bluetooth | Autoconfigurable |