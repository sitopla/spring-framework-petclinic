# Implementation Plan: Export Veterinarians List to PDF

**Branch**: `002-export-vets-pdf` | **Date**: 2026-03-14 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-export-vets-pdf/spec.md`

## Summary

Add a PDF export button to the veterinarians page that downloads the
complete vet list (name + specialties) as a branded PDF with the
PetClinic logo, title, and generation date. The implementation follows
the existing JSON/XML export pattern: a new `@GetMapping("/vets.pdf")`
endpoint in `VetController` that writes the PDF directly to the HTTP
response using the OpenPDF library.

## Technical Context

**Language/Version**: Java 17 (enforced by maven-enforcer-plugin)
**Primary Dependencies**: Spring Framework 6.2.9 (MVC), OpenPDF 3.0.3 (new)
**Storage**: N/A — read-only feature using existing `ClinicService.findVets()` (cached)
**Testing**: JUnit Jupiter 5.13.2, Mockito 5.17.0, Spring MockMvc, AssertJ 3.27.3
**Target Platform**: WAR on Jetty 11 / Tomcat 10+
**Project Type**: Web application (server-rendered MVC)
**Performance Goals**: PDF generation < 3 seconds for up to 500 vets (SC-005)
**Constraints**: No Spring Boot; 100% XML config; Java 17 baseline
**Scale/Scope**: Single new endpoint + 1 utility class + JSP modification + i18n keys

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Assessment |
|-----------|--------|------------|
| I. Layered Architecture | ✅ PASS | PDF generation is a presentation-layer concern. Controller → Service flow unchanged. No repository changes. |
| II. XML Configuration | ✅ PASS | No new `@Configuration` classes. New classes in `web/` package are auto-scanned by existing `mvc-core-config.xml` component-scan. No XML changes required. |
| III. Multi-Profile Persistence | ✅ PASS | No new data access operations. Uses existing `findVets()` which is persistence-profile-agnostic and cached. |
| IV. Test-First Quality | ⚠️ GATE | MockMvc test required for `/vets.pdf` endpoint. Must verify: status 200, content-type `application/pdf`, Content-Disposition header, valid PDF bytes. JaCoCo ≥ 80% lines / ≥ 75% branches on new code. |
| V. Observability | ⚠️ GATE | New classes MUST use SLF4J. PDF generation errors MUST log full stack trace. |
| VI. Internationalization | ⚠️ GATE | New message key `exportPdf` MUST be added to all 4 bundles: `messages.properties`, `messages_en.properties`, `messages_de.properties`, `messages_es.properties`. |
| VII. Simplicity | ✅ PASS | OpenPDF is the minimal dependency needed (LGPL/MPL license, lightweight, Java 17+ compatible). No alternative Spring-native mechanism exists — `AbstractPdfView` is deprecated in Spring 6.x. |

**Gate result**: All principles satisfied or addressable during implementation.

## Project Structure

### Documentation (this feature)

```text
specs/002-export-vets-pdf/
├── plan.md              # This file
├── research.md          # Phase 0: technology decision (OpenPDF)
├── data-model.md        # Phase 1: entity mapping (existing entities)
├── quickstart.md        # Phase 1: verification guide
├── contracts/
│   └── vets-pdf-endpoint.md  # Phase 1: HTTP contract for /vets.pdf
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── main/
│   ├── java/org/springframework/samples/petclinic/
│   │   └── web/
│   │       ├── VetController.java          # MODIFY: add showPdfVetList()
│   │       └── VetPdfGenerator.java        # NEW: PDF generation utility
│   ├── resources/
│   │   └── messages/
│   │       ├── messages.properties         # MODIFY: add exportPdf key
│   │       ├── messages_en.properties      # MODIFY: add exportPdf key
│   │       ├── messages_de.properties      # MODIFY: add exportPdf key
│   │       └── messages_es.properties      # MODIFY: add exportPdf key
│   └── webapp/
│       └── WEB-INF/jsp/vets/
│           └── vetList.jsp                 # MODIFY: add PDF export link
├── test/
│   └── java/org/springframework/samples/petclinic/
│       └── web/
│           └── VetControllerTests.java     # MODIFY: add PDF endpoint tests
pom.xml                                     # MODIFY: add OpenPDF dependency
```

**Structure Decision**: Existing Spring MVC project structure. New code
goes in the `web/` package (presentation layer) to respect the layered
architecture. `VetPdfGenerator` is a `@Component` in the `web` package,
auto-scanned by the existing `<context:component-scan base-package="...web"/>`.

## Complexity Tracking

> No constitution violations requiring justification.

| Decision | Rationale | Alternative Rejected |
|----------|-----------|----------------------|
| OpenPDF over Apache PDFBox | Simpler API for table generation; lighter weight | PDFBox has verbose low-level API for tables |
| OpenPDF over iText 7+ | LGPL/MPL license compatible with project; iText 7 is AGPL | AGPL too restrictive for an open-source demo project |
| Direct HttpServletResponse write over AbstractPdfView | AbstractPdfView is deprecated in Spring 6.x | No viable Spring-native alternative |
| @Component in web/ over Service layer bean | PDF rendering is a view/presentation concern, not business logic | Service layer would violate layer semantics |
