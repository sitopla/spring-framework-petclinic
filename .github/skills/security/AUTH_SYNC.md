# Skill: Sincronización de Seguridad (JWT & CORS)

**Propósito:** Establecer un contrato de seguridad bidireccional entre el Frontend y los Microservicios para evitar errores de acceso, bloqueos de CORS y discrepancias en los tokens.

---

## 🛡️ 1. Configuración de CORS (Cross-Origin Resource Sharing)

**Regla:** El microservicio debe permitir explícitamente el origen del frontend para evitar bloqueos del navegador en peticiones asíncronas.

### Protocolo de Actuación:
- **Detección:** El agente debe buscar el puerto del frontend en `frontend/package.json` o archivos `.env`.
- **Configuración:** Permitir siempre los headers `Authorization` y `Content-Type`.
- **Implementación de Referencia (Spring Boot):**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addMapping("/**")
        .allowedOrigins("http://localhost:3000") // Sincronizado con el Front
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("Authorization", "Content-Type")
        .allowCredentials(true);
}
