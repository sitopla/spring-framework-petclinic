# Java Expert Agent - Extended Instructions
## Estándares de Codificación
- **Persistencia:** Implementa Spring Data JPA y usa Flyway/Liquibase.
- **Testing:** Genera tests con JUnit 5, Mockito y Testcontainers.
- **Contexto:** Lee siempre `.github/context/user-stories.md` antes de proponer cambios.
- **Arquitectura:** Si detectas `/domain`, aplica Arquitectura Hexagonal.
- **Resiliencia:** Sigue las directrices en `.github/skills/resilience/resilience4j-patterns.md`.
- **Calidad:** Asegura un mínimo del 80% de cobertura de líneas y 75% de ramas con JaCoCo.



# Architectural Guardrail: Mandatory Resilience

**Regla Crítica:** Queda estrictamente prohibido realizar llamadas HTTP externas (vía FeignClient, RestTemplate o WebClient) sin un patrón de resiliencia definido.

**Protocolo de Verificación:**
1. **Detección:** Si el código utiliza `@FeignClient` o inyecta clientes HTTP, verifica la presencia de la anotación `@CircuitBreaker`.
2. **Acción:** Si falta el Circuit Breaker, debes detener la sugerencia de código y emitir el siguiente aviso: 
   > "⚠️ ALERTA DE ARQUITECTURA: Se ha detectado una llamada externa sin protección. Según la Skill 'resilience4j-patterns', debes implementar un Circuit Breaker y un método Fallback."
3. **Sincronización:** Consulta siempre la Skill `.github/skills/resilience/resilience4j-patterns.md` para proponer la implementación correcta del fallback y la configuración del `application.yml`.


# Quality Gate: JaCoCo Coverage Standards

Antes de dar por finalizada cualquier tarea de creación o modificación de tests, debes seguir este protocolo de verificación:

1. **Umbral de Cobertura:** Todo código nuevo o modificado debe alcanzar al menos un **80% de cobertura de líneas** y **75% de cobertura de ramas (branches)**.
2. **Uso de JaCoCo:**
   - Si el usuario pide validar tests, ejecuta o sugiere el comando `mvn clean verify` o `./gradlew test jacocoTestReport`.
   - Analiza el reporte generado en `target/site/jacoco/index.html` (o equivalente).
3. **Refactorización Proactiva:** Si detectas que los tests generados no cubren casos de borde (edge cases) o excepciones (catch blocks), debes notificarlo y sugerir los casos de prueba adicionales necesarios para elevar el reporte de JaCoCo.
4. **Aviso de Calidad:** Si la cobertura no cumple con los umbrales establecidos, emite el siguiente aviso:
   > "⚠️ ALERTA DE CALIDAD: La cobertura de tests actual es insuficiente. Se requiere al menos 80% de cobertura de líneas y 75% de cobertura de ramas. Por favor, añade más casos de prueba para cumplir con estos estándares."


# standard: Observability-First (Tracing & Logging)

**Objetivo:** Garantizar la trazabilidad distribuida en toda la malla de microservicios utilizando Spring Cloud Sleuth / Micrometer Tracing.

## 1. Reglas de Logging Contextual
- **Anotación:** Todo componente `@Service` o `@Controller` debe usar la anotación `@Slf4j` de Lombok.
- **Trazas de Entrada/Salida:** Cada método público debe iniciar con un log informativo que incluya los parámetros de entrada relevantes.
- **Correlation ID:** Asegúrate de que los logs mencionen que el `traceId` y `spanId` serán inyectados automáticamente por el interceptor de Spring.

## 2. Manejo de Errores con Trazabilidad
- Todo bloque `catch` debe registrar el stacktrace completo usando `log.error("Mensaje descriptivo", e)`.
- Se debe implementar un `@RestControllerAdvice` global que capture excepciones y devuelva un `ProblemDetail` (RFC 7807) incluyendo el `traceId` en la respuesta para soporte técnico.

## 3. Métricas de Negocio
- En operaciones críticas (ej. `processPayment`, `createOrder`), sugiere la inclusión de la anotación `@Timed` de Micrometer para medir latencia y rendimiento en Prometheus.

## 4. Auditoría de Mensajería
- Para eventos asíncronos (Kafka/RabbitMQ), el log debe indicar claramente el origen del evento y el ID de correlación extraído del header del mensaje.