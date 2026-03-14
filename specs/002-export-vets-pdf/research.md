# Research: Export Veterinarians List to PDF

**Feature**: 002-export-vets-pdf
**Date**: 2026-03-14

## R1: PDF Generation Library Selection

### Decision: OpenPDF 3.0.3

**Rationale**: OpenPDF is the community-maintained fork of iText 2.x,
actively developed under LGPL 2.1 / MPL 2.0 dual license. It is the
lightest-weight option that provides table, image, and font support out
of the box.

**Alternatives considered**:

| Library | Version | License | Java 17 | Verdict |
|---------|---------|---------|---------|---------|
| OpenPDF | 3.0.3 | LGPL/MPL | ✅ | **Selected** — lightweight, simple API, permissive license |
| iText 7+ | 8.x | AGPL-3.0 | ✅ | Rejected — AGPL incompatible with project's Apache 2.0 license |
| Apache PDFBox | 3.x | Apache 2.0 | ✅ | Rejected — verbose low-level API for simple table generation; no built-in table abstraction |
| Flying Saucer | 9.x | LGPL | ✅ | Rejected — HTML-to-PDF approach is overkill; adds transitive dependencies |

**Maven coordinates**:
```xml
<dependency>
    <groupId>com.github.librepdf</groupId>
    <artifactId>openpdf</artifactId>
    <version>${openpdf.version}</version>
</dependency>
```

Property: `<openpdf.version>3.0.3</openpdf.version>`

## R2: Spring Framework PDF View Strategy

### Decision: Direct HttpServletResponse write in controller

**Rationale**: Spring Framework 6.2.9 has deprecated
`AbstractPdfView` (from `spring-webmvc` view.document package) and
will remove it in a future release. The Spring team recommends writing
PDF bytes directly to `HttpServletResponse` or implementing a custom
`View` subclass.

The existing VetController already uses `@ResponseBody` with `produces`
for JSON and XML. For PDF, we write to the response output stream
directly (since PDF is binary and cannot use `@ResponseBody` with
message converters cleanly).

**Pattern**:
```java
@GetMapping("/vets.pdf")
public void showPdfVetList(HttpServletResponse response) throws IOException {
    Vets vets = getVets();
    response.setContentType("application/pdf");
    response.setHeader("Content-Disposition",
        "attachment; filename=\"veterinarians.pdf\"");
    vetPdfGenerator.generate(vets, response.getOutputStream());
}
```

**Alternatives considered**:

| Approach | Verdict |
|----------|---------|
| `AbstractPdfView` subclass | Rejected — deprecated in Spring 6.x, slated for removal |
| Custom `View` bean registered in `mvc-view-config.xml` | Viable but more complex; content negotiation not needed for explicit URL `/vets.pdf` |
| `@ResponseBody` with custom `HttpMessageConverter` | Over-engineered for a single endpoint |

## R3: PDF Layout Design

### Decision: Simple branded table document

**Layout**:
- **Page**: A4 portrait (595 × 842 points)
- **Header**: PetClinic logo (left-aligned, max 120pt width, aspect
  ratio preserved) + title "Veterinarians" (bold, 18pt) + generation
  date in ISO format (12pt, gray)
- **Table**: Two columns — "Name" (60% width) and "Specialties"
  (40% width). Header row with background color. Cell padding 5pt.
  Auto text wrapping for long content.
- **Footer**: Page numbers "Page X of Y" (centered, 10pt)
- **Font**: Helvetica (built-in PDF font, no external font files needed)

**Logo resilience**: If `spring-pivotal-logo.png` cannot be loaded, the
header renders title and date only — no exception thrown (FR-006).

## R4: i18n Message Keys

### Decision: Single new key `exportPdf`

| Bundle | Key | Value |
|--------|-----|-------|
| `messages.properties` | `exportPdf` | `Export to PDF` |
| `messages_en.properties` | `exportPdf` | `Export to PDF` |
| `messages_de.properties` | `exportPdf` | `Als PDF exportieren` |
| `messages_es.properties` | `exportPdf` | `Exportar a PDF` |

## R5: Error Handling Strategy

### Decision: Catch-and-redirect with logging

If PDF generation throws an exception:
1. Log the full stack trace via `log.error("...", e)` (Constitution V)
2. The existing `SimpleMappingExceptionResolver` in `mvc-core-config.xml`
   will catch the exception and render `WEB-INF/jsp/exception.jsp`
   (FR-011).

No custom error handling needed — the existing infrastructure covers it.
