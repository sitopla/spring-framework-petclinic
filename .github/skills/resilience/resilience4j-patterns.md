# Skill: Patrones de Resiliencia con Resilience4j

**Contexto:** Implementación de tolerancia a fallos en comunicaciones inter-servicio (Feign, RestTemplate, WebClient).

**Reglas de Oro:**
1. **Circuit Breaker:** Usar siempre ante llamadas externas para evitar fallos en cascada.
2. **Retry:** Aplicar solo en operaciones idempotentes (GET, HEAD). Nunca en POST/PUT sin validación de duplicados.
3. **Fallbacks:** Todo método con resiliencia DEBE tener un método de "fallback" para mantener la disponibilidad del sistema.
4. **Configuración:** Preferir anotaciones `@CircuitBreaker`, `@Retry` y `@Bulkhead` de `io.github.resilience4j`.

**Ejemplo de Referencia (Gold Standard):**
```java
@Service
@Slf4j
public class OrderServiceClient {

    @CircuitBreaker(name = "inventoryService", fallbackMethod = "fallbackInventory")
    @Retry(name = "inventoryService")
    public InventoryResponse checkStock(Long productId) {
        // Llamada al microservicio de inventario
        return restTemplate.getForObject("/api/inventory/" + productId, InventoryResponse.class);
    }

    private InventoryResponse fallbackInventory(Long productId, Throwable t) {
        log.error("Fallo en servicio de inventario para producto {}: {}", productId, t.getMessage());
        return new InventoryResponse(productId, 0, "Default (Fallback)");
    }
}
