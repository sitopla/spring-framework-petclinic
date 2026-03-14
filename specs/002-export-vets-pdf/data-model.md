# Data Model: Export Veterinarians List to PDF

**Feature**: 002-export-vets-pdf
**Date**: 2026-03-14

## Existing Entities (no changes required)

This feature is read-only — it exports existing data. No new entities,
fields, or schema changes are needed.

### Vet

| Field | Type | Source |
|-------|------|--------|
| id | Integer | `BaseEntity` (inherited) |
| firstName | String | `Person` (inherited) |
| lastName | String | `Person` (inherited) |
| specialties | Set\<Specialty\> | `@ManyToMany` (eager fetch) |

**PDF mapping**: `firstName + " " + lastName` → "Name" column.

### Specialty

| Field | Type | Source |
|-------|------|--------|
| id | Integer | `BaseEntity` (inherited) |
| name | String | `NamedEntity` (inherited) |

**PDF mapping**: Space-separated specialty names → "Specialties" column.
If `vet.getNrOfSpecialties() == 0`, display "none".

### Vets (wrapper)

| Field | Type | Source |
|-------|------|--------|
| vetList | List\<Vet\> | Lazily initialized ArrayList |

**PDF mapping**: Each entry in `vetList` → one table row.

## Data Flow

```
ClinicService.findVets()     (cached in "vets" cache)
       │
       ▼
VetController.getVets()      (wraps Collection<Vet> into Vets object)
       │
       ▼
VetPdfGenerator.generate()   (iterates Vets.getVetList(), writes PDF)
       │
       ▼
HttpServletResponse          (binary PDF stream to browser)
```

## Static Resources

| Resource | Path | Usage |
|----------|------|-------|
| PetClinic logo | `src/main/webapp/resources/images/spring-pivotal-logo.png` | Embedded in PDF header |

**Note**: The logo is loaded from the servlet context at runtime via
`ServletContext.getResourceAsStream("/resources/images/spring-pivotal-logo.png")`.
If unavailable, the PDF generates without it (FR-006).
