# Contract: GET /vets.pdf

**Feature**: 002-export-vets-pdf
**Date**: 2026-03-14

## Endpoint

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/vets.pdf` |
| Produces | `application/pdf` |
| Auth | None (matches existing endpoints) |

## Request

No parameters. The endpoint returns all veterinarians (same dataset as
`/vets`, `/vets.json`, `/vets.xml`).

## Response — Success (200 OK)

### Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `application/pdf` |
| `Content-Disposition` | `attachment; filename="veterinarians.pdf"` |

### Body

Binary PDF document containing:

1. **Header section**:
   - PetClinic logo (left-aligned, from
     `/resources/images/spring-pivotal-logo.png`)
   - Title: "Veterinarians" (bold, 18pt)
   - Date: generation date in ISO format `YYYY-MM-DD` (12pt, gray)

2. **Table**:
   | Column | Width | Content |
   |--------|-------|---------|
   | Name | 60% | `firstName + " " + lastName` |
   | Specialties | 40% | Space-separated specialty names, or "none" if empty |

3. **Footer**: Page number "Page X of Y" (centered)

## Response — Empty List (200 OK)

Same structure as success but with an empty table or a "No
veterinarians found" message in place of the table body.

## Response — Server Error (500)

Handled by the existing `SimpleMappingExceptionResolver`:
- Renders `WEB-INF/jsp/exception.jsp` error page
- Never exposes raw stack traces to the user

## Consistency with Existing Endpoints

| Endpoint | Content-Type | Mechanism |
|----------|-------------|-----------|
| `GET /vets` | `text/html` | JSP view via `InternalResourceViewResolver` |
| `GET /vets.json` | `application/json` | `@ResponseBody` + Jackson |
| `GET /vets.xml` | `application/xml` | `@ResponseBody` + JAXB |
| `GET /vets.pdf` | `application/pdf` | Direct `HttpServletResponse` write via OpenPDF |

All four endpoints share the same data source:
`VetController.getVets()` → `ClinicService.findVets()` (cached).
