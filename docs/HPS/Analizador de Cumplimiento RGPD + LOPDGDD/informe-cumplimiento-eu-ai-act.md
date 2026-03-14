# Informe EU AI Act (Reglamento UE 2024/1689) — Spring Framework PetClinic

**Fecha:** 2026-03-07  
**Analista:** EU AI Act Compliance Analyzer  
**Sistema analizado:** `spring-framework-petclinic` v7.0.3  
**Tecnologías:** Spring Framework 7.0.3, Spring MVC, JPA/Hibernate 7.2.3, JSP, HSQLDB/H2/MySQL/PostgreSQL

---

## Clasificación de Riesgo: NO APLICABLE (actualmente)

**Estado de cumplimiento:** ✅ NO APLICA — El sistema no contiene componentes de IA/ML  
**Fecha límite de cumplimiento:** Agosto 2026 (si se incorporan componentes de alto riesgo)

---

## Resumen Ejecutivo

| Concepto | Resultado |
|---|---|
| Componentes de IA/ML detectados | **0** — Ninguno |
| Librerías ML en dependencias (pom.xml) | **0** — Ninguna |
| Modelos serializado (.pkl, .h5, .onnx, .pt, .pb, .pmml) | **0** — Ninguno |
| Endpoints de inferencia | **0** — Ninguno |
| Chatbots o asistentes virtuales | **0** — Ninguno |
| Lógica de decisión automatizada sobre personas | **0** — Ninguna |
| Prácticas prohibidas (Art. 5) | **0** — Ninguna detectada |

### Conclusión Principal

El sistema Spring Framework PetClinic es una **aplicación CRUD convencional** de gestión de clínica veterinaria. Toda la lógica de negocio es determinista: formularios de entrada, validación de datos, persistencia en base de datos relacional y presentación en JSP. **No existe ningún componente de inteligencia artificial, aprendizaje automático, ni toma de decisiones automatizadas.**

Por lo tanto, el **Reglamento UE 2024/1689 (EU AI Act) no es directamente aplicable** al sistema en su estado actual.

---

## Análisis Detallado de Componentes

### Fase 1: Búsqueda de señales de IA/ML en el código

#### 1.1 Dependencias (pom.xml)

Se analizó el archivo `pom.xml` completo buscando cualquier librería relacionada con IA/ML:

| Librería buscada | ¿Detectada? |
|---|---|
| TensorFlow / TensorFlow Java | ❌ No |
| PyTorch / DJL (Deep Java Library) | ❌ No |
| DL4J (Deeplearning4j) | ❌ No |
| Weka | ❌ No |
| Tribuo (Oracle) | ❌ No |
| Smile (Statistical ML) | ❌ No |
| ONNX Runtime | ❌ No |
| PMML (jpmml) | ❌ No |
| Spring AI | ❌ No |
| LangChain4j | ❌ No |
| OpenAI Java SDK | ❌ No |
| Azure AI SDK | ❌ No |
| AWS SageMaker SDK | ❌ No |
| scikit-learn (Python) | ❌ No |
| XGBoost | ❌ No |
| Keras | ❌ No |

**Dependencias reales del proyecto:** Spring Framework 7.0.3, Hibernate 7.2.3, HSQLDB/H2, Caffeine Cache, SLF4J/Logback, JUnit 5, Mockito, Hamcrest, AssertJ — todas relacionadas con desarrollo web y persistencia.

#### 1.2 Modelos serializados

Se buscaron archivos de modelos ML en todo el repositorio:

| Formato | Extensión | ¿Detectado? |
|---|---|---|
| Python pickle | `.pkl`, `.joblib` | ❌ No |
| Keras / TensorFlow | `.h5`, `.pb`, `saved_model/` | ❌ No |
| ONNX | `.onnx` | ❌ No |
| PyTorch | `.pt`, `.pth` | ❌ No |
| PMML | `.pmml` | ❌ No |
| Checkpoints | `checkpoint*` | ❌ No |

#### 1.3 Patrones de código de inferencia

Se buscaron en las 44 clases Java del proyecto (`src/main/java/`) patrones indicativos de IA:

| Patrón buscado | ¿Detectado? | Contexto |
|---|---|---|
| `predict()` | ❌ No | — |
| `classify()` | ❌ No | — |
| `diagnos*` | ❌ No | — |
| `inference` | ❌ No | — |
| `recommend*` | ❌ No | — |
| `score()` | ❌ No | — |
| `model.load*` | ❌ No | — |
| `neural*` | ❌ No | — |
| `embedding*` | ❌ No | — |
| `transformer*` | ❌ No | — |
| `feature_importance` / `shap` / `lime` | ❌ No | — |

#### 1.4 Prácticas prohibidas del Art. 5

| Práctica prohibida | ¿Detectada? |
|---|---|
| Social scoring sobre personas | ❌ No |
| Manipulación subliminal de comportamiento | ❌ No |
| Explotación de vulnerabilidades (menores, mayores) | ❌ No |
| Identificación biométrica remota en tiempo real | ❌ No |
| Inferencia de emociones en trabajo/educación | ❌ No |
| Categorización biométrica con características sensibles | ❌ No |
| Predicción criminal basada en perfilado | ❌ No |

**Resultado: ✅ Ninguna práctica prohibida del Art. 5 detectada.**

---

## Evaluación de Riesgo Potencial para Futuras Funcionalidades

Aunque el sistema actual no contiene IA, el dominio de la clínica veterinaria tiene puntos de contacto con el sector salud que podrían desencadenar obligaciones si se incorporasen funcionalidades de IA en el futuro.

### Escenarios de riesgo si se añade IA

| Escenario futuro hipotético | Clasificación EU AI Act | Referencia |
|---|---|---|
| **Chatbot veterinario** que responde consultas de propietarios | **Riesgo limitado** (Art. 50) — Obligación de transparencia: informar que es IA | Art. 50.1 |
| **Sistema de diagnóstico veterinario** asistido por IA (análisis de imágenes, síntomas) | **Riesgo mínimo** (animales ≠ personas) pero **cuidado:** si afecta decisiones sobre personas (ej. zoonosis) podría escalar | Art. 6 |
| **Asignación automática de citas** por prioridad/urgencia con ML | **Riesgo mínimo** a menos que afecte prestación de servicios a personas | — |
| **Análisis predictivo de enfermedades** en mascotas que recomienda tratamientos | **Riesgo mínimo** (veterinaria ≠ medicina humana) | — |
| **Sistema de scoring de propietarios** para valorar solvencia/responsabilidad | **⚠️ Potencialmente alto riesgo** si afecta al acceso a servicios o genera perfilado de personas | Anexo III.5-6 |
| **IA para administración pública veterinaria** (licencias, sanciones, valoración de peligrosidad de animales) | **⚠️ Alto riesgo** si toma decisiones sobre derechos de ciudadanos | Anexo III.6 |
| **Reconocimiento facial de propietarios** para acceso al sistema | **⚠️ Alto riesgo** — biometría para identificación | Anexo III.1 |
| **IA que decide eutanasia** de animales sin intervención humana | **⚠️ Ético** — aunque no regulado directamente, implicaciones de bienestar animal | — |

### Clasificación por dominio de despliegue

```
SI el sistema se despliega en:

┌─────────────────────────────────────────┐
│ Clínica veterinaria privada             │ → Riesgo mínimo (no trata sobre personas)
│ (sin componentes de IA sobre personas)  │   EU AI Act NO aplica
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Servicio veterinario de la              │ → Si se añade IA → potencialmente
│ Administración Pública (CCAA,           │   ALTO RIESGO (Anexo III.6:
│ Ayuntamiento) que gestiona              │   "acceso a prestaciones de servicios
│ licencias, sanciones, PPP              │    públicos esenciales")
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Hospital veterinario universitario      │ → Si se añade IA en educación →
│ (formación veterinarios)                │   ALTO RIESGO (Anexo III.3:
│                                         │   "sistemas de IA en educación")
└─────────────────────────────────────────┘
```

---

## Marco Preventivo: Guardrails para Futura Incorporación de IA

Aunque actualmente no aplica el EU AI Act, se recomienda establecer los siguientes guardrails arquitectónicos para que, si en el futuro se incorporan componentes de IA, el sistema esté preparado para cumplir.

### GP-01: Arquitectura preparada para logging de inferencias (Art. 12)

```java
/**
 * Interfaz base para cualquier componente de IA que se añada al sistema.
 * Garantiza logging conforme Art. 12 EU AI Act desde el diseño.
 */
public interface AIInferenceAuditable {

    /**
     * Toda inferencia debe registrarse antes de devolver resultado.
     */
    default <T> T executeWithAudit(Supplier<T> inference, AIInferenceContext ctx) {
        LocalDateTime start = LocalDateTime.now();
        T result = inference.get();
        LocalDateTime end = LocalDateTime.now();

        AIInferenceLog log = AIInferenceLog.builder()
            .timestamp(start)
            .durationMs(Duration.between(start, end).toMillis())
            .modelId(ctx.getModelId())
            .modelVersion(ctx.getModelVersion())
            .inputHash(sha256(ctx.getInputData()))
            .output(sanitize(result))
            .confidence(ctx.getConfidence())
            .requestingUserId(ctx.getUserId())
            .humanOverride(false) // Se actualizará si el usuario anula
            .build();

        inferenceLogRepository.save(log);
        return result;
    }
}
```

```java
@Entity
@Table(name = "ai_inference_logs")
public class AIInferenceLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "model_id", nullable = false)
    private String modelId;

    @Column(name = "model_version", nullable = false)
    private String modelVersion;

    @Column(name = "input_hash", nullable = false)
    private String inputHash; // SHA-256 — nunca datos en claro

    @Column(name = "output_summary")
    private String outputSummary;

    @Column
    private Double confidence;

    @Column(name = "requesting_user_id")
    private String requestingUserId;

    @Column(name = "human_override")
    private Boolean humanOverride;

    @Column(name = "override_reason")
    private String overrideReason;

    @Column(name = "duration_ms")
    private Long durationMs;

    @Column(name = "integrity_hmac", nullable = false)
    private String integrityHmac; // Inmutabilidad del registro

    // Conservación: mínimo 6 meses (Art. 12)
    // Para sector salud: conforme a normativa sectorial (puede ser mayor)
}
```

### GP-02: Patrón de supervisión humana obligatoria (Art. 14)

```java
/**
 * Patrón de diseño: toda recomendación de IA requiere confirmación humana.
 * Art. 14 EU AI Act — Supervisión humana.
 */
public class AIRecommendation<T> {

    private final T suggestedResult;
    private final double confidence;
    private final String explanation;
    private final String modelVersion;
    private final boolean requiresHumanApproval;

    private static final String DISCLAIMER =
        "⚠️ RECOMENDACIÓN GENERADA POR IA — " +
        "Requiere revisión y aprobación de un profesional cualificado. " +
        "El sistema de IA puede cometer errores.";

    /**
     * Factory method para alto riesgo: siempre requiere aprobación humana.
     */
    public static <T> AIRecommendation<T> highRisk(
            T result, double confidence, String explanation, String modelVersion) {
        return new AIRecommendation<>(result, confidence, explanation,
            modelVersion, true);
    }

    /**
     * Factory method para riesgo limitado: aprobación opcional pero informada.
     */
    public static <T> AIRecommendation<T> limitedRisk(
            T result, double confidence, String explanation, String modelVersion) {
        return new AIRecommendation<>(result, confidence, explanation,
            modelVersion, false);
    }

    public String getDisclaimer() { return DISCLAIMER; }

    /**
     * El profesional debe invocar este método para confirmar.
     * Se registra la decisión humana en el log de auditoría.
     */
    public T approveByHuman(String userId, String justification) {
        // Registrar la aprobación humana
        AuditLog.log("AI_RECOMMENDATION_APPROVED",
            Map.of("userId", userId,
                   "justification", justification,
                   "modelVersion", modelVersion,
                   "confidence", confidence));
        return suggestedResult;
    }

    /**
     * El profesional anula la recomendación de IA.
     * Se registra obligatoriamente el motivo.
     */
    public void overrideByHuman(String userId, String reason, T manualResult) {
        AuditLog.log("AI_RECOMMENDATION_OVERRIDDEN",
            Map.of("userId", userId,
                   "reason", reason,
                   "aiSuggested", suggestedResult.toString(),
                   "humanDecided", manualResult.toString(),
                   "modelVersion", modelVersion));
    }
}
```

### GP-03: Aviso de IA obligatorio en la interfaz (Art. 50)

```jsp
<%-- Tag JSP reutilizable para disclosure de IA --%>
<%-- Usar en cualquier vista que muestre output de IA --%>
<%@ tag trimDirectiveWhitespaces="true" %>
<%@ attribute name="modelName" required="true" %>
<%@ attribute name="confidence" required="false" type="java.lang.Double" %>

<div class="ai-disclosure alert alert-info" role="alert">
    <span class="ai-icon">🤖</span>
    <strong>Contenido generado por Inteligencia Artificial</strong>
    <p>
        Este resultado ha sido generado por el sistema de IA
        "<c:out value="${modelName}"/>".
        <c:if test="${not empty confidence}">
            Nivel de confianza: <strong><fmt:formatNumber
                value="${confidence}" type="percent"/></strong>.
        </c:if>
    </p>
    <p class="text-muted">
        Art. 50 Reglamento UE 2024/1689: Las personas tienen derecho a saber
        cuando interactúan con un sistema de IA.
        Este resultado es una sugerencia y no sustituye el criterio profesional.
    </p>
</div>
```

### GP-04: Checklist pre-despliegue de cualquier componente de IA

```java
/**
 * Anotación para marcar servicios que contienen componentes de IA.
 * Activa la validación de cumplimiento EU AI Act en tiempo de arranque.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AIComponent {

    /** Nivel de riesgo según EU AI Act */
    RiskLevel riskLevel();

    /** ID del modelo de IA */
    String modelId();

    /** Versión del modelo */
    String modelVersion();

    /** Fecha de la documentación técnica (Art. 11) */
    String technicalDocDate() default "";

    /** ¿Registrado en EUAI DB? (Art. 49) */
    boolean registeredInEUAIDB() default false;

    /** ¿DPIA realizada (si datos personales)? */
    boolean dpiaCompleted() default false;

    /** Persona responsable de supervisión humana */
    String humanOversightResponsible() default "";
}

public enum RiskLevel {
    UNACCEPTABLE,   // Art. 5 — PROHIBIDO
    HIGH,           // Anexo III — Obligaciones estrictas
    LIMITED,        // Art. 50 — Transparencia
    MINIMAL         // Sin obligaciones específicas
}
```

```java
/**
 * BeanPostProcessor que valida en arranque que todo @AIComponent
 * cumple con los requisitos mínimos del EU AI Act.
 */
@Component
@Slf4j
public class AIActComplianceValidator implements BeanPostProcessor {

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        AIComponent annotation = bean.getClass().getAnnotation(AIComponent.class);
        if (annotation == null) return bean;

        // Art. 5: Rechazar sistemas prohibidos
        if (annotation.riskLevel() == RiskLevel.UNACCEPTABLE) {
            throw new IllegalStateException(
                "⛔ EU AI ACT VIOLATION: Bean '" + beanName +
                "' classified as UNACCEPTABLE risk. " +
                "Prohibited under Art. 5 Regulation EU 2024/1689. " +
                "DEPLOYMENT BLOCKED.");
        }

        // Alto riesgo: verificar documentación y registro
        if (annotation.riskLevel() == RiskLevel.HIGH) {
            List<String> violations = new ArrayList<>();

            if (annotation.technicalDocDate().isBlank()) {
                violations.add("Art. 11: Missing technical documentation date");
            }
            if (!annotation.registeredInEUAIDB()) {
                violations.add("Art. 49: Not registered in EU AI Database");
            }
            if (annotation.humanOversightResponsible().isBlank()) {
                violations.add("Art. 14: No human oversight responsible designated");
            }
            if (!annotation.dpiaCompleted()) {
                violations.add("GDPR Art. 35: DPIA not completed for AI system");
            }

            if (!violations.isEmpty()) {
                log.error("⚠️ EU AI ACT: High-risk AI component '{}' has {} " +
                    "compliance issues: {}", beanName, violations.size(),
                    String.join("; ", violations));
                // En producción: considerar bloquear el arranque
                // throw new IllegalStateException(violations.toString());
            }
        }

        log.info("AI ACT: Component '{}' validated — risk={}, model={} v{}",
            beanName, annotation.riskLevel(),
            annotation.modelId(), annotation.modelVersion());

        return bean;
    }
}
```

### GP-05: Modelo de documentación técnica (Art. 11)

Si se incorpora cualquier componente de IA, debe crearse la siguiente documentación **antes del despliegue**:

```markdown
# Documentación Técnica AI — Art. 11 EU AI Act

## 1. Información General
- Nombre del sistema: [nombre]
- Proveedor: [empresa/equipo]
- Versión: [X.Y.Z]
- Fecha de documentación: [YYYY-MM-DD]
- Clasificación de riesgo: [Alto / Limitado / Mínimo]
- Referencia Anexo III: [punto aplicable]

## 2. Finalidad Prevista
- Caso de uso: [descripción detallada]
- Usuarios previstos: [veterinarios, administrativos, propietarios]
- Contexto de uso: [clínica privada / administración pública]
- Limitaciones conocidas: [cuándo NO usar el sistema]

## 3. Arquitectura Técnica
- Tipo de modelo: [red neuronal, árbol de decisión, LLM, etc.]
- Framework: [TensorFlow, PyTorch, etc.]
- Parámetros: [número de parámetros, hiperparámetros principales]
- Input: [descripción de datos de entrada]
- Output: [descripción de salida]

## 4. Datos de Entrenamiento
- Fuente: [origen de los datos]
- Volumen: [número de muestras]
- Período: [rango temporal]
- Preprocesado: [transformaciones aplicadas]
- Análisis de sesgo: [resultados por subgrupo]
- Consentimiento/base jurídica: [RGPD compliance]

## 5. Métricas de Rendimiento
- Accuracy: [valor ± intervalo confianza]
- Precision/Recall/F1: [por clase]
- AUC-ROC: [valor]
- Sensibilidad/Especificidad: [si aplica]
- Análisis de equidad: [métricas por subgrupo]
- Dataset de validación: [independiente de entrenamiento]

## 6. Supervisión Humana
- Responsable: [nombre y cargo]
- Mecanismo de override: [descripción]
- Protocolo de desconexión: [cómo desactivar]
- Modo degradado: [funcionamiento sin IA]

## 7. Monitorización Post-despliegue
- Métricas monitorizadas: [drift, precisión, latencia]
- Frecuencia de revisión: [mensual/trimestral]
- Criterios de reentrenamiento: [umbrales]
- Responsable de monitorización: [nombre]

## 8. Registro EU AI Database
- ID de registro: [pendiente / número]
- Fecha de registro: [YYYY-MM-DD]
- Declaración UE de conformidad: [referencia documento]
```

---

## Calendario de Aplicación y Relevancia

```
┌─────────────────────────────────────────────────────────────────┐
│                    CALENDARIO EU AI ACT                          │
├───────────────┬─────────────────────────────────────────────────┤
│ Feb 2025 ✅   │ Prohibiciones Art. 5 en vigor                   │
│               │ → PetClinic: No aplica (sin IA)                 │
├───────────────┼─────────────────────────────────────────────────┤
│ Ago 2025 ✅   │ Obligaciones GPAI (modelos de propósito general)│
│               │ → PetClinic: No aplica (sin GPAI)               │
├───────────────┼─────────────────────────────────────────────────┤
│ Ago 2026 ⏳   │ PLENA APLICACIÓN sistemas de alto riesgo        │
│               │ → PetClinic: Aplica SI se incorpora IA en       │
│               │   sector salud/admin pública antes de esta fecha│
├───────────────┼─────────────────────────────────────────────────┤
│ Ago 2027      │ Sistemas regulados por normativa sectorial      │
│               │ preexistente (dispositivos médicos, etc.)       │
└───────────────┴─────────────────────────────────────────────────┘
```

---

## Checklist de Cumplimiento Actual

| # | Requisito EU AI Act | Estado | Observaciones |
|---|---|---|---|
| 1 | Ausencia de prácticas prohibidas (Art. 5) | ✅ Conforme | Sin IA en el sistema |
| 2 | Clasificación de riesgo documentada | ⚪ N/A | Sin IA que clasificar |
| 3 | Documentación técnica (Art. 11) | ⚪ N/A | Sin IA que documentar |
| 4 | Logging de inferencias (Art. 12) | ⚪ N/A | Sin inferencias |
| 5 | Transparencia e información (Art. 13) | ⚪ N/A | Sin IA visible |
| 6 | Supervisión humana (Art. 14) | ⚪ N/A | Sin decisiones automatizadas |
| 7 | Precisión y solidez (Art. 15) | ⚪ N/A | Sin modelo que medir |
| 8 | Registro en EUAI DB (Art. 49) | ⚪ N/A | Sin sistema registrable |
| 9 | Aviso de IA a usuarios (Art. 50) | ⚪ N/A | Sin chatbot ni IA visible |
| 10 | Gobernanza de datos (Art. 10) | ⚪ N/A | Sin datos de entrenamiento |

---

## Recomendaciones

### Acción inmediata: Ninguna requerida

El sistema actual **no requiere ninguna acción de cumplimiento** con el EU AI Act.

### Acciones preventivas recomendadas (si se planea incorporar IA)

| # | Acción Preventiva | Prioridad | Plazo |
|---|---|---|---|
| 1 | Incorporar al `pom.xml` la interfaz `AIInferenceAuditable` (GP-01) como base para cualquier futuro servicio de IA | Baja | Antes de añadir IA |
| 2 | Crear tabla `ai_inference_logs` en el esquema de BD (GP-01) | Baja | Antes de añadir IA |
| 3 | Implementar el `AIActComplianceValidator` (GP-04) que valide en arranque | Baja | Antes de añadir IA |
| 4 | Crear plantilla de documentación técnica Art. 11 (GP-05) | Baja | Antes de añadir IA |
| 5 | Incorporar el tag JSP `ai-disclosure` (GP-03) para futuros componentes de IA | Baja | Antes de añadir IA |
| 6 | Establecer política interna de evaluación de riesgo AI Act para nuevas funcionalidades | Media | 0-90 días |
| 7 | Formar al equipo en obligaciones EU AI Act para sector veterinario/salud | Media | 0-90 días |

### Alerta crítica para el futuro

> **⚠️ AVISO: Si se incorpora cualquier componente de IA al sistema PetClinic, especialmente en un contexto de administración pública (servicio veterinario municipal, autonómico o estatal), se debe realizar una evaluación de riesgo ANTES del desarrollo y cumplir con todas las obligaciones del EU AI Act según la clasificación resultante. Los sistemas de IA en el sector salud (incluso veterinario si afecta a decisiones sobre personas) son automáticamente ALTO RIESGO según el Anexo III.**

---

## Referencias Normativas

- **EU AI Act:** Reglamento (UE) 2024/1689 del Parlamento Europeo y del Consejo, de 13 de junio de 2024, por el que se establecen normas armonizadas en materia de inteligencia artificial
- **Anexo III:** Lista de sistemas de IA de alto riesgo
- **Art. 5:** Prácticas de IA prohibidas
- **Arts. 8-15:** Requisitos para sistemas de IA de alto riesgo
- **Art. 49:** Registro de sistemas de alto riesgo
- **Art. 50:** Obligaciones de transparencia para determinados sistemas de IA
- **EU AI Act Database:** Base de datos europea de sistemas de IA de alto riesgo

---

> **Disclaimer:** Este informe es un análisis técnico del código fuente del sistema. No constituye asesoramiento jurídico. Si se incorporan componentes de IA en el futuro, se recomienda consultar con un equipo legal especializado en regulación de IA y con la Agencia Española de Supervisión de la IA (AESIA) para confirmar la clasificación de riesgo y las obligaciones aplicables.
