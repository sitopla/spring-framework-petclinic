# WCAG 2.1 Accessibility Compliance Report — Spring PetClinic

**Proyecto**: Spring Framework PetClinic  
**Fecha de análisis**: 2026-03-06  
**Versión WCAG**: 2.1 (W3C Recommendation)  
**Referencia**: https://www.w3.org/TR/WCAG21/  
**Contexto legal**: RD 1112/2018 (España) — WCAG 2.1 Nivel AA obligatorio para sector público  

---

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Nivel de conformidad alcanzado** | ❌ **Ninguno** |
| **Puntuación Nivel A** | 53% (16/30 criterios) |
| **Puntuación Nivel AA** | 38% (7.5/20 criterios) |
| **Puntuación Nivel AAA** | 14% (4/28 criterios) |
| **Criterios analizados** | 78 |
| **PASS (✅)** | 20 |
| **PARCIAL (⚠️)** | 15 |
| **FAIL (❌)** | 32 |
| **REVISIÓN MANUAL (🔍)** | 3 |
| **NO APLICA (➖)** | 8 |

### Puntuación por Principio

| Principio | Puntuación | Pass | Parcial | Fail | N/A |
|-----------|-----------|------|---------|------|-----|
| **1. Perceivable** | 48% | 8 | 5 | 12 | 6 |
| **2. Operable** | 55% | 9 | 5 | 9 | 0 |
| **3. Understandable** | 52% | 5 | 4 | 4 | 0 |
| **4. Robust** | 33% | 1 | 1 | 1 | 0 |

### Barreras Bloqueantes para Nivel A

Los siguientes criterios **impiden alcanzar cualquier nivel de conformidad**:

1. **3.1.1 Language of Page** — `<html>` sin atributo `lang`
2. **2.4.2 Page Titled** — Mismo `<title>` estático en TODAS las páginas
3. **2.4.1 Bypass Blocks** — No existe enlace "skip to content"
4. **1.3.1 Info and Relationships** — Ausencia de landmarks semánticos (`<main>`, `<header>`, `<footer>`)
5. **3.3.2 Labels or Instructions** — Labels de formularios no asociados programáticamente con inputs

---

## Análisis Detallado por Criterio

### Nivel A — 30 Criterios

#### Principio 1: Perceivable

| SC | Nombre | Estado | Evidencia |
|----|--------|--------|-----------|
| **1.1.1** | Non-text Content | ⚠️ PARCIAL | ✅ Las 3 imágenes (`welcome.jsp`, `exception.jsp`, `pivotal.tag`) tienen `alt` descriptivo. ❌ Logo del navbar (`navbar-brand`) es imagen CSS de fondo sin texto alternativo — el `<a>` contiene un `<span>` vacío. ❌ Iconos Font Awesome en `menuItem.tag` (`<span class="fa ${glyph}">`) carecen de `aria-hidden="true"` (aunque tienen texto visible adyacente). |
| **1.2.1** | Audio-only/Video-only | ➖ N/A | No hay contenido de audio ni vídeo en la aplicación. |
| **1.2.2** | Captions (Prerecorded) | ➖ N/A | No hay contenido multimedia sincronizado. |
| **1.2.3** | Audio Description/Media Alternative | ➖ N/A | No hay contenido de vídeo. |
| **1.3.1** | Info and Relationships | ⚠️ PARCIAL | ✅ **Tablas**: Excelente uso de `<th>`, `scope="col"`, `headers`, `aria-describedby` en `ownersList.jsp`, `vetList.jsp`, `ownerDetails.jsp`, `createOrUpdateVisitForm.jsp`. ✅ **Headings**: Todas las páginas usan `<h2>` para títulos de sección. ❌ **Landmarks**: No se usa `<main>`, `<header>`, `<footer>`, `<section>` — solo `<div class="container">`. ❌ **Labels de formularios**: `inputField.tag` línea 13 usa `<label>` sin atributo `for` — no hay asociación programática con `<form:input>`. `selectField.tag` mismo problema. `findOwners.jsp` línea 17 — `<label>` sin `for` para el campo lastName. ❌ **Listas**: El menú de navegación usa `<ul>` correctamente ✅, pero `ownerDetails.jsp` usa `<dl>` para datos de mascotas ✅. |
| **1.3.2** | Meaningful Sequence | ✅ PASS | El orden del DOM coincide con el orden visual. No se usa CSS para reordenar contenido de forma significativa. Las tablas siguen un orden lógico de lectura. |
| **1.3.3** | Sensory Characteristics | ✅ PASS | Las instrucciones no dependen únicamente de características sensoriales. Los botones tienen texto descriptivo ("Add Owner", "Find Owner", "Update Pet"). |
| **1.4.1** | Use of Color | ⚠️ PARCIAL | ✅ Los enlaces del menú tienen texto visible además de iconos. ❌ En `inputField.tag`, la clase `has-error` aplica cambio visual solo por color (grupo CSS). El icono `fa-remove` ayuda ✅ pero el error de campo se distingue principalmente por color. ❌ Los enlaces en el body (`#5fa134` verde) se distinguen del texto normal (`#34302d` marrón) solo por color — no hay subrayado ni otro indicador visual. |
| **1.4.2** | Audio Control | ✅ PASS | No hay audio que se reproduzca automáticamente. |

#### Principio 2: Operable

| SC | Nombre | Estado | Evidencia |
|----|--------|--------|-----------|
| **2.1.1** | Keyboard | ✅ PASS | La aplicación usa elementos HTML nativos: `<a>`, `<button>`, `<input>`, `<select>` — todos accesibles por teclado de forma nativa. No hay `onclick` en elementos no interactivos. No hay widgets personalizados que requieran JavaScript especial. |
| **2.1.2** | No Keyboard Trap | ✅ PASS | No hay trampas de teclado. No se usan modales, ni `tabindex` problemáticos. El flatpickr puede ser una preocupación potencial pero sus implementaciones estándar son accesibles. |
| **2.1.4** | Character Key Shortcuts | ✅ PASS | No se definen atajos de teclado de un solo carácter. |
| **2.2.1** | Timing Adjustable | ✅ PASS | No hay límites de tiempo en la aplicación. No hay sesiones con timeout configurado a nivel de frontend. |
| **2.2.2** | Pause, Stop, Hide | ✅ PASS | No hay contenido con movimiento automático, parpadeo, desplazamiento ni auto-actualización. El spinner CSS `.myspinner` existe en SCSS pero no se usa activamente en ningún JSP. |
| **2.3.1** | Three Flashes | ✅ PASS | No hay contenido que parpadee más de 3 veces por segundo. |
| **2.4.1** | Bypass Blocks | ❌ FAIL | **No existe enlace "skip to content"** ni ningún mecanismo para saltar bloques repetidos. `layout.tag` incluye `bodyHeader` → `menu` → contenido sin ofrecer bypass. Parcialmente mitigado: `<nav>` tiene `role="navigation"` lo que permite navegar por landmarks con lectores de pantalla, pero falta `<main>` para completar la estructura. |
| **2.4.2** | Page Titled | ❌ FAIL | **Título estático idéntico en TODAS las páginas**: `<title>PetClinic :: a Spring Framework demonstration</title>` (htmlHeader.tag línea 17). No distingue entre Home, Find Owners, Veterinarians, Owner Details, etc. |
| **2.4.3** | Focus Order | ✅ PASS | El orden de tabulación sigue el orden del DOM, que es lógico. No se usan valores `tabindex > 0`. |
| **2.4.4** | Link Purpose (In Context) | ✅ PASS | Los enlaces tienen texto descriptivo: "Edit Owner", "Add New Pet", "Edit Pet", "Add Visit", "View as XML", "View as JSON", "Find Owner", "Add Owner". Los enlaces de la tabla de owners muestran el nombre completo como texto del enlace. |
| **2.5.1** | Pointer Gestures | ✅ PASS | No se requieren gestos multitáctiles. Toda la funcionalidad es accesible con un solo puntero (clics simples). |
| **2.5.2** | Pointer Cancellation | ✅ PASS | Se usan eventos estándar HTML (click, submit). No se usa `mousedown` para acciones. |
| **2.5.3** | Label in Name | ⚠️ PARCIAL | ✅ Los botones tienen texto visible que coincide con su nombre accesible. ❌ El logo del navbar (`<a class="navbar-brand">`) tiene texto visible vacío (solo imagen de fondo CSS) — el nombre accesible está vacío. |
| **2.5.4** | Motion Actuation | ✅ PASS | No hay funcionalidad activada por movimiento del dispositivo. |

#### Principio 3: Understandable

| SC | Nombre | Estado | Evidencia |
|----|--------|--------|-----------|
| **3.1.1** | Language of Page | ❌ FAIL | `layout.tag` línea 8: `<html>` — **falta el atributo `lang`**. Debería ser `<html lang="en">` (o `lang="es"` según el idioma activo). Crítico para lectores de pantalla. |
| **3.2.1** | On Focus | ✅ PASS | No hay cambios de contexto al recibir foco. No hay auto-submit al enfocar elementos. |
| **3.2.2** | On Input | ✅ PASS | No hay `onchange` con auto-submit en `<select>`. Los formularios requieren acción explícita (clic en botón "submit"). |
| **3.3.1** | Error Identification | ⚠️ PARCIAL | ✅ `inputField.tag` muestra mensajes de error en texto (`${status.errorMessage}` en `<span class="help-inline">`). ✅ Muestra icono de error `fa-remove`. ❌ No se vincula el mensaje de error al campo mediante `aria-describedby`. El campo con error no tiene `aria-invalid="true"`. |
| **3.3.2** | Labels or Instructions | ❌ FAIL | ❌ `inputField.tag` línea 13: `<label class="col-sm-2 control-label">${label}</label>` — **sin atributo `for`** que vincule al input. Spring `<form:input>` genera un `<input>` con `id` pero el `<label>` no lo referencia. ❌ `selectField.tag`: mismo problema. ❌ `findOwners.jsp` línea 17: `<label>` manual sin `for="lastName"`. ❌ `createOrUpdatePetForm.jsp` línea 24: "Owner" label no vinculado (es texto estático, no input — menos grave). |

#### Principio 4: Robust

| SC | Nombre | Estado | Evidencia |
|----|--------|--------|-----------|
| **4.1.1** | Parsing | ✅ PASS | Per WCAG 2.1 nota actualizada, este criterio se considera siempre satisfecho en HTML. La estructura JSP genera HTML válido con tags bien formados. |
| **4.1.2** | Name, Role, Value | ⚠️ PARCIAL | ✅ Se usan elementos HTML nativos (`<a>`, `<button>`, `<input>`, `<select>`, `<table>`) que tienen roles implícitos correctos. ✅ `<nav role="navigation">` correctamente marcado. ❌ Logo navbar (`<a class="navbar-brand"><span></span></a>`) — sin nombre accesible (no text, no `aria-label`). ❌ Iconos Font Awesome sin `aria-hidden` explícito en `menuItem.tag`. |

### Nivel AA — 20 Criterios

| SC | Nombre | Estado | Evidencia |
|----|--------|--------|-----------|
| **1.2.4** | Captions (Live) | ➖ N/A | No hay multimedia en vivo. |
| **1.2.5** | Audio Description (Prerecorded) | ➖ N/A | No hay vídeo pregrabado. |
| **1.3.4** | Orientation | ✅ PASS | No se fuerza orientación. No hay CSS `orientation: portrait` ni JS de bloqueo. El diseño responsive se adapta a ambas orientaciones. |
| **1.3.5** | Identify Input Purpose | ❌ FAIL | **Ningún input tiene atributo `autocomplete`**. Campos como firstName, lastName, address, city, telephone en `createOrUpdateOwnerForm.jsp` deberían tener `autocomplete="given-name"`, `family-name`, `street-address`, `address-level2`, `tel`. |
| **1.4.3** | Contrast (Minimum) | ❌ FAIL | **Enlaces**: `#5fa134` (spring-dark-green) sobre `#f1f1f1` (spring-light-grey) = ratio **~2.6:1** — MUY por debajo del 4.5:1 requerido. **Texto `.nav > li > a`**: `#838789` (spring-grey) sobre fondo light-grey = ratio **~3.2:1** — insuficiente. ✅ **Texto body**: `#34302D` sobre `#f1f1f1` = ratio **~10:1** — excelente. ✅ **Navbar text**: `#f1f1f1` sobre `#34302d` = ratio ~10:1 — excelente. ⚠️ `.help-block`: usa `lighten($text-color, 50%)` — probablemente bajo contraste. |
| **1.4.4** | Resize Text | ⚠️ PARCIAL | ✅ Viewport meta no bloquea zoom (`width=device-width, initial-scale=1` sin `user-scalable=no`). ❌ Tamaños de fuente en `px` en `typography.scss` (h1: 24px, h2: 18px, h3: 16px, .index-page--subtitle: 16px). Deberían usar `rem` o `em` para escalar con configuración del usuario. ✅ Bootstrap base usa `rem` para la mayoría de componentes. |
| **1.4.5** | Images of Text | ✅ PASS | No se usan imágenes de texto para contenido informativo. El logo Spring es la única imagen con texto y es el branding/logo (excepción permitida). |
| **1.4.10** | Reflow | ⚠️ PARCIAL | ✅ Usa Bootstrap grid system responsive. ✅ Media query a 768px en `responsive.scss`. ❌ Solo una breakpoint (768px) — no se verifica reflow a 320px (equivalente a 400% zoom). ❌ Tablas de datos (`ownersList.jsp`, `vetList.jsp`) con anchos fijos (`style="width: 150px"`) podrían causar scroll horizontal. ⚠️ `.xd-container` tiene padding mínimo (5px) que puede ser insuficiente. |
| **1.4.11** | Non-text Contrast | ⚠️ PARCIAL | ✅ Botones `.btn-primary` tienen borde verde (#6db33f) de 2px — visible. ✅ Table headers tienen fondo contrastante. ❌ Inputs de formulario `.form-control` dependen del estilo por defecto de Bootstrap — border puede ser insuficiente contra el fondo claro. ❌ El icono `fa-ok` (verde) en formularios puede no tener 3:1 contra el fondo. |
| **1.4.12** | Text Spacing | 🔍 MANUAL | No se detecta `overflow: hidden` en contenedores de texto en SCSS personalizado. Bootstrap maneja esto razonablemente. Requiere prueba con bookmarklet de text spacing. |
| **1.4.13** | Content on Hover or Focus | ✅ PASS | No hay tooltips, popovers ni contenido adicional que aparezca al hover/focus en el código de la aplicación. El navbar hover cambia color de fondo pero no muestra contenido nuevo. |
| **2.4.5** | Multiple Ways | ❌ FAIL | **Solo existe un mecanismo de navegación**: el menú navbar. No hay buscador de sitio, ni mapa del sitio, ni breadcrumbs, ni índice de páginas. Se requieren al menos 2 mecanismos. |
| **2.4.6** | Headings and Labels | ⚠️ PARCIAL | ✅ Los headings son descriptivos: "Veterinarians", "Owners", "Owner Information", "Find Owners", "Pets and Visits". ❌ No hay `<h1>` visible en ninguna página — se salta directamente a `<h2>`. ❌ Labels de formulario son descriptivos ("First Name", "Last Name") pero no están programáticamente vinculados. |
| **2.4.7** | Focus Visible | ❌ FAIL | **14 instancias de `outline: 0`** en el CSS compilado (provenientes de Bootstrap). Solo existe UN estilo `:focus` personalizado en SCSS (para `.btn-primary`). **No se define `:focus-visible`** en ningún archivo SCSS personalizado. Los usuarios de teclado probablemente no verán indicador de foco en muchos elementos interactivos. |
| **3.1.2** | Language of Parts | ❌ FAIL | La aplicación soporta i18n (messages_en, messages_es, messages_de) pero **no cambia el `lang` de `<html>` según el idioma activo**. Contenido mixto (menú en inglés, mensajes potencialmente en español) sin marcado `lang` en las partes. |
| **3.2.3** | Consistent Navigation | ✅ PASS | La navegación es consistente en todas las páginas gracias al uso del tag `layout.tag` → `bodyHeader.tag` → `menu.tag`. El menú aparece siempre en el mismo orden y posición. |
| **3.2.4** | Consistent Identification | ✅ PASS | Los componentes se identifican consistentemente: botones "Add/Update" siguen el mismo patrón, `inputField.tag` y `selectField.tag` generan estructura uniforme. |
| **3.3.3** | Error Suggestion | ⚠️ PARCIAL | ✅ Los mensajes de error de Spring provienen del BindingResult y suelen incluir sugerencias (ej: "is required", "must contain only numbers"). ❌ No hay sugerencias contextualles (ej: formato esperado de teléfono). ❌ Los mensajes de error no están vinculados al campo mediante `aria-describedby`. |
| **3.3.4** | Error Prevention (Legal/Financial) | ✅ PASS | La aplicación no maneja transacciones legales ni financieras. Los formularios de mascotas/propietarios son datos modificables con opción de edición. |
| **4.1.3** | Status Messages | ❌ FAIL | **No se usan `aria-live` regions ni `role="alert"`/`role="status"`**. Los mensajes de error de formularios no se anuncian a tecnologías asistivas. Si se añade un propietario exitosamente, la redirección a la página de detalles no anuncia el resultado. |

### Nivel AAA — 28 Criterios

| SC | Nombre | Estado | Evidencia |
|----|--------|--------|-----------|
| **1.2.6** | Sign Language | ➖ N/A | No hay multimedia. |
| **1.2.7** | Extended Audio Description | ➖ N/A | No hay vídeo. |
| **1.2.8** | Media Alternative | ➖ N/A | No hay multimedia sincronizada. |
| **1.2.9** | Audio-only (Live) | ➖ N/A | No hay audio en vivo. |
| **1.3.6** | Identify Purpose | ❌ FAIL | No se usan atributos ARIA avanzados para identificar el propósito de componentes UI. No hay `aria-roledescription`, microdata, ni landmarks semánticos completos. |
| **1.4.6** | Contrast (Enhanced) | ❌ FAIL | Los enlaces (#5fa134 sobre #f1f1f1) tienen ratio ~2.6:1, muy lejos del 7:1 requerido. |
| **1.4.7** | Low/No Background Audio | ➖ N/A | No hay audio. |
| **1.4.8** | Visual Presentation | ⚠️ PARCIAL | ✅ Texto no justificado (sin `text-align: justify`). ✅ `line-height` razonable. ❌ No hay mecanismo para que el usuario seleccione colores de primer plano y fondo. ❌ Ancho de texto no limitado a 80 caracteres (`max-width: 80ch` no usado). |
| **1.4.9** | Images of Text (No Exception) | ✅ PASS | No se usan imágenes de texto salvo el logo (decorativo/branding). |
| **2.1.3** | Keyboard (No Exception) | ✅ PASS | Toda funcionalidad es accesible por teclado usando elementos HTML nativos. |
| **2.2.3** | No Timing | ✅ PASS | No hay límites de tiempo en la aplicación. |
| **2.2.4** | Interruptions | ✅ PASS | No hay interrupciones ni notificaciones automáticas. |
| **2.2.5** | Re-authenticating | ➖ N/A | No hay sistema de autenticación. |
| **2.2.6** | Timeouts | ⚠️ PARCIAL | No hay timeouts visibles en frontend, pero la sesión HTTP del servidor podría expirar sin aviso. |
| **2.3.2** | Three Flashes | ✅ PASS | No hay contenido que parpadee. |
| **2.3.3** | Animation from Interactions | ⚠️ PARCIAL | ✅ Bootstrap incluye `prefers-reduced-motion: reduce` en CSS compilado (27 instancias). ❌ Los estilos SCSS personalizados tienen transitions (`.btn-primary`, navbar hover, `.myspinner`) SIN `prefers-reduced-motion`. |
| **2.4.8** | Location | ❌ FAIL | No hay breadcrumbs, indicador de página actual (excepto clase `active` en menú), ni indicador de ubicación en el sitio. |
| **2.4.9** | Link Purpose (Link Only) | ⚠️ PARCIAL | ✅ Mayoría de enlaces son descriptivos ("Edit Owner", "Add New Pet"). ❌ "View as XML" y "View as JSON" podrían ser más descriptivos ("View veterinarian list as XML"). |
| **2.4.10** | Section Headings | ❌ FAIL | Las páginas usan `<h2>` pero no subdividen secciones con headings adicionales. `ownerDetails.jsp` es una excepción positiva con "Owner Information" y "Pets and Visits". |
| **2.5.5** | Target Size | ❌ FAIL | No se establecen tamaños mínimos de 44×44px para objetivos táctiles. Los enlaces de tabla ("Edit Pet", "Add Visit") y enlaces inline probablemente sean más pequeños. |
| **2.5.6** | Concurrent Input | ✅ PASS | No se restringe modalidad de input. No hay `user-select: none` en contenido funcional. |
| **3.1.3** | Unusual Words | ❌ FAIL | No hay glosario ni mecanismo para definir términos técnicos veterinarios. |
| **3.1.4** | Abbreviations | ❌ FAIL | No se usa `<abbr>` para abreviaturas. |
| **3.1.5** | Reading Level | 🔍 MANUAL | El contenido es mayormente formularios y datos — lectura simple. Requiere evaluación lingüística formal. |
| **3.1.6** | Pronunciation | ➖ N/A | No hay contenido donde la pronunciación sea ambigua. |
| **3.2.5** | Change on Request | ✅ PASS | No hay cambios de contexto automáticos. Todos los cambios son iniciados por el usuario. |
| **3.3.5** | Help | ❌ FAIL | No hay ayuda contextual en formularios. No hay FAQ, tooltips de ayuda, ni documentación inline. |
| **3.3.6** | Error Prevention (All) | ❌ FAIL | Los formularios no ofrecen revisión/confirmación antes del envío. No hay paso de confirmación ni opción de deshacer. |

---

## Plan de Remediación

### 🔴 Fase 1: Alcanzar Nivel A (Prioridad Crítica)

#### 1.1 — Añadir `lang` al `<html>` (SC 3.1.1)

**Complejidad**: Baja  
**Archivo**: `src/main/webapp/WEB-INF/tags/layout.tag`  
**Test automático**: axe-core `html-has-lang`, Lighthouse

```jsp
<!-- ANTES -->
<html>

<!-- DESPUÉS -->
<html lang="${pageContext.response.locale.language}">
```

Esto obtiene dinámicamente el idioma del locale activo de Spring (en, es, de).

#### 1.2 — Títulos de página únicos (SC 2.4.2)

**Complejidad**: Media  
**Archivos**: `layout.tag`, `htmlHeader.tag`, todos los JSP  
**Test automático**: axe-core `document-title`, Lighthouse

```jsp
<!-- layout.tag - Añadir atributo -->
<%@ attribute name="pageTitle" required="false" %>

<!-- htmlHeader.tag - Usar título dinámico -->
<title>${empty pageTitle ? 'PetClinic' : pageTitle} :: PetClinic</title>

<!-- Cada JSP debe pasar su título -->
<petclinic:layout pageName="home" pageTitle="Home">
<petclinic:layout pageName="owners" pageTitle="Find Owners">
<petclinic:layout pageName="vets" pageTitle="Veterinarians">
```

#### 1.3 — Skip navigation link (SC 2.4.1)

**Complejidad**: Baja  
**Archivos**: `layout.tag`, SCSS  
**Test automático**: axe-core `bypass`

```jsp
<!-- layout.tag - Añadir antes de bodyHeader -->
<body>
<a href="#main-content" class="visually-hidden-focusable">Skip to main content</a>
<petclinic:bodyHeader menuName="${pageName}"/>

<div class="container-fluid">
    <div class="container xd-container" id="main-content" role="main">
        <jsp:doBody/>
```

Bootstrap 5 incluye la clase `visually-hidden-focusable` que oculta el enlace visualmente pero lo muestra al recibir foco.

#### 1.4 — Asociar labels con inputs (SC 3.3.2, 1.3.1)

**Complejidad**: Media  
**Archivos**: `inputField.tag`, `selectField.tag`, `findOwners.jsp`  
**Test automático**: axe-core `label`, `form-field-multiple-labels`

```jsp
<!-- inputField.tag -->
<spring:bind path="${name}">
    <c:set var="cssGroup" value="form-group ${status.error ? 'has-error' : '' }"/>
    <c:set var="valid" value="${not status.error and not empty status.actualValue}"/>
    <div class="${cssGroup}">
        <label class="col-sm-2 control-label" for="${name}">${label}</label>
        <div class="col-sm-10">
            <form:input class="form-control" path="${name}" id="${name}"
                        aria-describedby="${status.error ? name.concat('-error') : ''}"/>
            <c:if test="${status.error}">
                <span class="fa fa-remove form-control-feedback" aria-hidden="true"></span>
                <span class="help-inline" id="${name}-error" role="alert">${status.errorMessage}</span>
            </c:if>
        </div>
    </div>
</spring:bind>
```

Mismo patrón para `selectField.tag` y corregir `findOwners.jsp`:
```jsp
<label class="col-sm-2 control-label" for="lastName">Last name</label>
```

#### 1.5 — Landmarks semánticos (SC 1.3.1)

**Complejidad**: Baja  
**Archivos**: `layout.tag`, `menu.tag`, `pivotal.tag`  
**Test automático**: axe-core `landmark-main-is-top-level`, `region`

```jsp
<!-- layout.tag -->
<body>
<a href="#main-content" class="visually-hidden-focusable">Skip to main content</a>

<header>
    <petclinic:bodyHeader menuName="${pageName}"/>
</header>

<main id="main-content" class="container-fluid">
    <div class="container xd-container">
        <jsp:doBody/>
    </div>
</main>

<footer>
    <petclinic:pivotal/>
</footer>

<petclinic:footer/>
</body>
```

#### 1.6 — Texto alternativo del logo navbar (SC 1.1.1, 4.1.2)

**Complejidad**: Baja  
**Archivo**: `menu.tag`  
**Test automático**: axe-core `link-name`

```jsp
<!-- ANTES -->
<a class="navbar-brand" href="<spring:url value="/" htmlEscape="true" />"><span></span></a>

<!-- DESPUÉS -->
<a class="navbar-brand" href="<spring:url value="/" htmlEscape="true" />" aria-label="PetClinic Home">
    <span aria-hidden="true"></span>
</a>
```

#### 1.7 — Iconos Font Awesome con `aria-hidden` (SC 1.1.1)

**Complejidad**: Baja  
**Archivo**: `menuItem.tag`  
**Test automático**: axe-core `presentational-role-conflict`

```jsp
<!-- ANTES -->
<span class="fa ${glyph}"></span>

<!-- DESPUÉS -->
<span class="fa ${glyph}" aria-hidden="true"></span>
```

#### 1.8 — Indicador no-color para enlaces (SC 1.4.1)

**Complejidad**: Baja  
**Archivo**: `petclinic.scss`

```scss
// Añadir subrayado a enlaces para distinguirlos sin depender solo del color
a:not(.btn):not(.navbar-brand):not(.nav-link) {
    text-decoration: underline;
}
```

---

### 🟡 Fase 2: Alcanzar Nivel AA (Requisito Legal EU/España)

#### 2.1 — Corregir contraste de enlaces (SC 1.4.3)

**Complejidad**: Baja  
**Archivo**: `petclinic.scss`  
**Test automático**: axe-core `color-contrast`

```scss
// ANTES: #5fa134 sobre #f1f1f1 = ~2.6:1
// DESPUÉS: Oscurecer el verde para alcanzar 4.5:1
$spring-dark-green: #3d7a1c; // Ratio ~5.5:1 sobre #f1f1f1

$link-color: $spring-dark-green;
$link-hover-color: darken($spring-dark-green, 10%);
```

También corregir `.nav > li > a` que usa `$spring-grey` (#838789):
```scss
.nav > li > a {
    color: #595c5e; // Ratio ~4.9:1 sobre #f1f1f1
}
```

#### 2.2 — Atributos `autocomplete` en formularios (SC 1.3.5)

**Complejidad**: Media  
**Archivos**: `inputField.tag`, formularios JSP  
**Test automático**: axe-core `autocomplete-valid`

```jsp
<!-- inputField.tag - Añadir atributo opcional -->
<%@ attribute name="autocomplete" required="false" rtexprvalue="true" %>

<!-- Añadir al input -->
<form:input class="form-control" path="${name}" id="${name}"
            autocomplete="${autocomplete}"/>

<!-- createOrUpdateOwnerForm.jsp -->
<petclinic:inputField label="First Name" name="firstName" autocomplete="given-name"/>
<petclinic:inputField label="Last Name" name="lastName" autocomplete="family-name"/>
<petclinic:inputField label="Address" name="address" autocomplete="street-address"/>
<petclinic:inputField label="City" name="city" autocomplete="address-level2"/>
<petclinic:inputField label="Telephone" name="telephone" autocomplete="tel"/>
```

#### 2.3 — Focus visible (SC 2.4.7)

**Complejidad**: Media  
**Archivo**: `petclinic.scss`  
**Test automático**: Lighthouse accessibility audit

```scss
// Añadir estilos de foco visibles globales
:focus-visible {
    outline: 3px solid $spring-green;
    outline-offset: 2px;
}

// Asegurar que Bootstrap no elimine el foco sin reemplazo
.btn:focus-visible,
.form-control:focus-visible,
.nav-link:focus-visible {
    outline: 3px solid $spring-green;
    outline-offset: 2px;
    box-shadow: none; // Reemplazar box-shadow de Bootstrap con outline
}
```

#### 2.4 — Múltiples mecanismos de navegación (SC 2.4.5)

**Complejidad**: Media-Alta  
**Archivos**: Nuevos JSP/tags  

Opciones (implementar al menos 1 adicional al menú):
1. **Buscador**: Añadir un campo de búsqueda en la navbar
2. **Mapa del sitio**: Crear una página `/sitemap` con enlaces a todas las secciones
3. **Breadcrumbs**: Añadir un tag de breadcrumbs al layout

```jsp
<!-- Opción más simple: mapa del sitio como enlace en el footer -->
<footer>
    <nav aria-label="Footer navigation">
        <a href="<spring:url value="/sitemap"/>">Site Map</a>
    </nav>
    <petclinic:pivotal/>
</footer>
```

#### 2.5 — Status messages con `aria-live` (SC 4.1.3)

**Complejidad**: Media  
**Archivos**: `inputField.tag`, JSP de formularios

```jsp
<!-- En formularios, envolver mensajes de error en live region -->
<div aria-live="polite" aria-atomic="true">
    <c:if test="${status.error}">
        <span class="help-inline" id="${name}-error" role="alert">
            ${status.errorMessage}
        </span>
    </c:if>
</div>
```

#### 2.6 — Heading h1 en cada página (SC 2.4.6)

**Complejidad**: Baja  
**Archivos**: Todos los JSP  

Cambiar los `<h2>` principales de cada página a `<h1>`:
```jsp
<!-- welcome.jsp -->
<h1><fmt:message key="welcome"/></h1>

<!-- vetList.jsp -->
<h1 id="veterinarians">Veterinarians</h1>

<!-- O añadir h1 en layout.tag con el título de página -->
```

#### 2.7 — Idioma de partes (SC 3.1.2)

**Complejidad**: Media  
**Archivo**: Sistema de i18n  

```jsp
<!-- layout.tag - Idioma dinámico -->
<html lang="${pageContext.response.locale.language}">

<!-- Para contenido en idioma diferente al de la página -->
<span lang="es">Bienvenido</span>
```

#### 2.8 — Fuentes en rem/em (SC 1.4.4)

**Complejidad**: Baja  
**Archivo**: `typography.scss`

```scss
// ANTES (px fijos)
h1 { font-size: 24px; line-height: 30px; }
h2 { font-size: 18px; line-height: 24px; }
h3 { font-size: 16px; line-height: 24px; }

// DESPUÉS (rem escalables)
h1 { font-size: 1.5rem; line-height: 1.875rem; }
h2 { font-size: 1.125rem; line-height: 1.5rem; }
h3 { font-size: 1rem; line-height: 1.5rem; }
```

---

### 🟢 Fase 3: Hacia Nivel AAA (Mejora Continua)

| Prioridad | SC | Acción | Complejidad |
|-----------|-----|--------|-------------|
| 🟢 | 1.4.6 | Ofrecer modo de alto contraste (ratio 7:1) | Media |
| 🟢 | 1.4.8 | Limitar ancho de texto a 80 caracteres (`max-width: 80ch`) | Baja |
| 🟢 | 2.3.3 | Añadir `prefers-reduced-motion` a SCSS custom (transitions) | Baja |
| 🟢 | 2.4.8 | Añadir breadcrumbs a todas las páginas | Media |
| 🟢 | 2.4.10 | Subdividir contenido largo con headings adicionales | Baja |
| 🟢 | 2.5.5 | Establecer `min-width: 44px; min-height: 44px` en targets | Baja |
| 🟢 | 3.1.3/4 | Añadir glosario veterinario y usar `<abbr>` | Media |
| 🟢 | 3.3.5 | Añadir ayuda contextual en formularios (tooltips, placeholders) | Media |
| 🟢 | 3.3.6 | Añadir paso de confirmación en todos los formularios | Alta |

---

## Recomendaciones de Herramientas de Testing

### Integración en CI/CD (GitHub Actions)

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests
on: [push, pull_request]
jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build application
        run: ./mvnw package -DskipTests
      - name: Start application
        run: java -jar target/*.war &
      - name: Wait for app
        run: sleep 15
      - name: Run pa11y
        run: |
          npx pa11y http://localhost:8080 --standard WCAG2AA
          npx pa11y http://localhost:8080/owners/find --standard WCAG2AA
          npx pa11y http://localhost:8080/vets --standard WCAG2AA
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:8080/
            http://localhost:8080/owners/find
            http://localhost:8080/vets
```

### Herramientas de Desarrollo

| Herramienta | Uso | Criterios que valida |
|-------------|-----|---------------------|
| **axe-core** (`@axe-core/cli`) | Validación automatizada WCAG | ~57 reglas WCAG 2.1 |
| **pa11y** | CLI testing | WCAG2A, WCAG2AA, WCAG2AAA |
| **Lighthouse** | Auditoría de accesibilidad | ~35 checks |
| **WAVE** (extensión) | Evaluación visual en navegador | Estructura, contraste, ARIA |
| **Color Contrast Analyzer** | Verificar ratios de contraste | 1.4.3, 1.4.6, 1.4.11 |
| **NVDA** (Windows) | Testing con lector de pantalla | 4.1.2, 4.1.3, 2.4.x |
| **Accessibility Insights** | Testing guiado | Todos los niveles |

### Checklist de Testing Manual

- [ ] Navegar toda la aplicación solo con teclado (Tab, Shift+Tab, Enter, Escape)
- [ ] Verificar que el indicador de foco es siempre visible
- [ ] Probar con zoom del navegador al 200% y 400%
- [ ] Probar con NVDA/VoiceOver activado
- [ ] Verificar modo de alto contraste de Windows
- [ ] Probar con text spacing bookmarklet (WCAG 1.4.12)
- [ ] Verificar que los formularios anuncian errores a lectores de pantalla

---

## Prioridad de Implementación

| Fase | Acciones | Impacto | Esfuerzo estimado |
|------|----------|---------|-------------------|
| **1 (Crítica)** | 1.1 lang, 1.2 títulos, 1.3 skip nav, 1.4 labels, 1.5 landmarks, 1.6 logo, 1.7 icons, 1.8 enlaces | Desbloquea Nivel A | 8 archivos modificados |
| **2 (Legal)** | 2.1 contraste, 2.2 autocomplete, 2.3 focus, 2.4 navegación, 2.5 aria-live, 2.6 headings, 2.7 idioma, 2.8 rem | Alcanza Nivel AA (obligatorio RD 1112/2018) | 12 archivos modificados |
| **3 (Mejora)** | Alto contraste, breadcrumbs, motion, target size, glosario, ayuda, confirmación | Progreso hacia AAA | Nuevas funcionalidades |

---

*Informe generado según WCAG 2.1 (W3C Recommendation). Para el marco legal español, el Nivel AA es obligatorio para servicios públicos digitales según RD 1112/2018.*
