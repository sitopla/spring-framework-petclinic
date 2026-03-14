---
name: resilience
description: Implement fault tolerance patterns with Resilience4j for Spring microservices. Use when adding Circuit Breaker, Retry, Bulkhead, or Rate Limiter to HTTP clients (Feign, RestTemplate, WebClient). Ensures fallback methods and proper configuration.
---

# Resilience4j Patterns for Spring Microservices

Implement fault tolerance in inter-service communications using Resilience4j.

## Golden Rules

1. **Circuit Breaker**: Always use for external HTTP calls to prevent cascade failures
2. **Retry**: Only for idempotent operations (GET, HEAD). Never on POST/PUT without duplicate validation
3. **Fallbacks**: Every resilient method MUST have a fallback to maintain system availability
4. **Annotations**: Prefer `@CircuitBreaker`, `@Retry`, `@Bulkhead` from `io.github.resilience4j`

## Quick Reference

### Dependencies (Maven)

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
    <version>2.2.0</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

### Implementation Pattern

```java
@Service
@Slf4j
public class ExternalServiceClient {

    @CircuitBreaker(name = "externalService", fallbackMethod = "fallbackMethod")
    @Retry(name = "externalService")
    public ResponseDTO callExternalService(Long id) {
        return restTemplate.getForObject("/api/external/" + id, ResponseDTO.class);
    }

    private ResponseDTO fallbackMethod(Long id, Throwable t) {
        log.error("External service failed for id {}: {}", id, t.getMessage());
        return ResponseDTO.defaultResponse(id);
    }
}
```

### Configuration (application.yml)

```yaml
resilience4j:
  circuitbreaker:
    instances:
      externalService:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
        permittedNumberOfCallsInHalfOpenState: 3
  retry:
    instances:
      externalService:
        maxAttempts: 3
        waitDuration: 500ms
        retryExceptions:
          - java.io.IOException
          - java.net.SocketTimeoutException
```

## Detailed Patterns

See [resilience4j-patterns.md](resilience4j-patterns.md) for complete examples.

## Validation Checklist

- [ ] All `@FeignClient` methods have `@CircuitBreaker`
- [ ] All RestTemplate/WebClient calls are wrapped with resilience
- [ ] Fallback methods exist for every protected method
- [ ] Configuration exists in `application.yml`
- [ ] Retry only on idempotent operations
