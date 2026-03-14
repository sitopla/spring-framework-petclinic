# Quickstart: Export Veterinarians List to PDF

**Feature**: 002-export-vets-pdf
**Date**: 2026-03-14

## Prerequisites

- Java 17+ installed
- Maven 3.8.4+ (or use the included `mvnw` / `mvnw.cmd` wrapper)

## Build & Run

```bash
# From the repository root:
./mvnw clean compile    # verify the project compiles with OpenPDF
./mvnw jetty:run-war    # start the application on http://localhost:8080
```

On Windows: replace `./mvnw` with `.\mvnw.cmd`.

## Verify the Feature

### 1. Visual Check (browser)

1. Open http://localhost:8080/vets in your browser.
2. Below the veterinarians table, verify the "Export to PDF" link is
   visible alongside the existing "View as XML" and "View as JSON"
   links.
3. Click "Export to PDF".
4. Verify:
   - A file named `veterinarians.pdf` is downloaded.
   - The PDF opens without errors.
   - The header contains the PetClinic logo, "Veterinarians" title,
     and today's date.
   - The table lists all veterinarians with their specialties.
   - Vets without specialties show "none".

### 2. Direct URL Check

Navigate directly to http://localhost:8080/vets.pdf — the PDF should
download immediately.

### 3. i18n Check

Append `?lang=de` or `?lang=es` to the vets page URL and verify the
export button label changes to the appropriate language.

### 4. Empty List Check

If possible, configure a database with no veterinarians and verify
the PDF still generates with a header and an empty table / "No
veterinarians found" message.

## Run Tests

```bash
./mvnw test -Dtest=VetControllerTests    # run only vet controller tests
./mvnw verify                            # full test suite + JaCoCo
```

### Expected Test Results

| Test | Assertion |
|------|-----------|
| `testShowPdfVetList()` | Status 200, Content-Type `application/pdf`, Content-Disposition header present, response body starts with `%PDF` |
| `testShowPdfVetListEmpty()` | Status 200, valid PDF even with empty vet list |

## Check Coverage

After `mvn verify`, open `target/site/jacoco/index.html` and verify:
- `VetPdfGenerator` — ≥ 80% line coverage, ≥ 75% branch coverage
- `VetController` — coverage does not regress
