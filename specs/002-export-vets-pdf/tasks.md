# Tasks: Export Veterinarians List to PDF

**Input**: Design documents from `/specs/002-export-vets-pdf/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Included — Constitution Principle IV (Test-First Quality) mandates tests for all new functionality. JaCoCo gates: ≥ 80% lines / ≥ 75% branches.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the OpenPDF dependency so all subsequent PDF work can compile.

- [x] T001 Add `<openpdf.version>3.0.3</openpdf.version>` property and `com.github.librepdf:openpdf:${openpdf.version}` dependency to `pom.xml` in the `<properties>` (after `<aspectj.version>`) and `<dependencies>` sections respectively
- [x] T002 Verify project compiles cleanly with `./mvnw.cmd compile` — zero errors, OpenPDF classes available on classpath

**Checkpoint**: OpenPDF available — PDF generation code can now be written.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational tasks needed. This feature adds to an existing, fully-configured application. All infrastructure (component scanning, exception handling, message sources, caching) is already in place.

**Checkpoint**: Foundation ready — proceed directly to user stories.

---

## Phase 3: User Story 1 — Download Vets List as PDF (Priority: P1) 🎯 MVP

**Goal**: A `GET /vets.pdf` endpoint that generates and downloads a PDF with a table of all veterinarians and their specialties.

**Independent Test**: Navigate to `/vets.pdf` in a browser and verify a valid PDF downloads with a two-column table matching the HTML view data.

### Tests for User Story 1

> **NOTE: Write tests FIRST, ensure they FAIL before implementation (RED phase)**

- [x] T003 [US1] Write `testShowPdfVetList()` in `src/test/java/org/springframework/samples/petclinic/web/VetControllerTests.java` — MockMvc GET `/vets.pdf`: assert status 200, content-type `application/pdf`, header `Content-Disposition` contains `attachment` and `veterinarians.pdf`, response body starts with `%PDF` magic bytes
- [x] T004 [US1] Write `testShowPdfVetListWithVetWithoutSpecialties()` in `VetControllerTests.java` — verify PDF is generated successfully when a vet has zero specialties (no exceptions thrown, valid PDF returned)

### Implementation for User Story 1

- [x] T005 [US1] Create `VetPdfGenerator` component in `src/main/java/org/springframework/samples/petclinic/web/VetPdfGenerator.java` — `@Component` with SLF4J logger; method `generate(Vets vets, OutputStream out)` that creates an A4 portrait PDF document with a `PdfPTable` (2 columns: "Name" at 60% width, "Specialties" at 40% width), styled header row with background color, iterates `vets.getVetList()` mapping `firstName + " " + lastName` to Name column and space-joined specialty names (or "none") to Specialties column; cell padding 5pt; auto text wrapping for long content; closes the document after writing. Log entry at INFO level on generate call and full stack trace via `log.error()` in catch blocks.
- [x] T006 [US1] Add `showPdfVetList(HttpServletResponse)` endpoint in `src/main/java/org/springframework/samples/petclinic/web/VetController.java` — `@GetMapping("/vets.pdf")`, inject `VetPdfGenerator` via constructor alongside existing `ClinicService`; call `getVets()` (existing private method), set response content-type to `application/pdf`, set `Content-Disposition: attachment; filename="veterinarians.pdf"`, delegate to `vetPdfGenerator.generate(vets, response.getOutputStream())`
- [x] T007 [US1] Run tests with `./mvnw.cmd test -Dtest=VetControllerTests` — verify T003 and T004 pass (GREEN phase). Fix any issues until all tests are green.

**Checkpoint**: At this point, `GET /vets.pdf` downloads a valid PDF with the vet table. MVP is functional.

---

## Phase 4: User Story 2 — PDF Header with PetClinic Logo (Priority: P2)

**Goal**: The PDF includes a branded header with the PetClinic logo, the title "Veterinarians", the generation date in ISO format, and page numbers in the footer.

**Independent Test**: Download the PDF and verify the first page header contains the logo image, title text, and today's date. Multi-page PDFs show "Page X of Y" in footer.

### Tests for User Story 2

- [x] T008 [US2] Write `testPdfContainsHeaderContent()` in `VetControllerTests.java` — download PDF from `/vets.pdf`, extract text content and verify it contains the string "Veterinarians" and today's date in `YYYY-MM-DD` format
- [x] T009 [US2] Write `testPdfGeneratesWithoutLogo()` unit test for `VetPdfGenerator` in a new file `src/test/java/org/springframework/samples/petclinic/web/VetPdfGeneratorTests.java` — call `generate()` with a null or missing logo path and verify a valid PDF is produced (no exceptions, output starts with `%PDF`), satisfying FR-006

### Implementation for User Story 2

- [x] T010 [US2] Enhance `VetPdfGenerator` in `src/main/java/org/springframework/samples/petclinic/web/VetPdfGenerator.java` — inject `ServletContext` via constructor; before the table, add a header section: load `spring-pivotal-logo.png` from `servletContext.getResourceAsStream("/resources/images/spring-pivotal-logo.png")`, scale to max 120pt width preserving aspect ratio, place left-aligned; add "Veterinarians" title (Helvetica Bold 18pt) and generation date `LocalDate.now().toString()` (Helvetica 12pt, gray) right of the logo; wrap in a try-catch so missing/corrupt logo logs a warning but does not abort generation (FR-006). Add page event handler for "Page X of Y" footer (centered, Helvetica 10pt).
- [x] T011 [US2] Run tests with `./mvnw.cmd test -Dtest=VetControllerTests,VetPdfGeneratorTests` — verify T008 and T009 pass. Fix any issues.

**Checkpoint**: PDF now has professional branding with logo, title, date, and page numbers.

---

## Phase 5: User Story 3 — UI Placement and Internationalization (Priority: P3)

**Goal**: The PDF export link appears on the veterinarians JSP page alongside the existing XML/JSON links, with the label translated in all four supported locales.

**Independent Test**: Open `/vets` page in each locale and verify the PDF export link is visible, properly translated, and functional.

### Implementation for User Story 3

- [x] T012 [P] [US3] Add `exportPdf` key to all four message bundles in `src/main/resources/messages/`: `messages.properties` → `exportPdf=Export to PDF`; `messages_en.properties` → `exportPdf=Export to PDF`; `messages_de.properties` → `exportPdf=Als PDF exportieren`; `messages_es.properties` → `exportPdf=Exportar a PDF`
- [x] T013 [US3] Add PDF export link in `src/main/webapp/WEB-INF/jsp/vets/vetList.jsp` — inside the existing `<div class="row">` that contains the XML and JSON links, add a new `<div class="col-md-2">` with an `<a>` tag pointing to `<spring:url value="/vets.pdf" htmlEscape="true" />` and using `<spring:message code="exportPdf"/>` as the link text, matching the style of the adjacent XML/JSON links
- [x] T014 [US3] Run `./mvnw.cmd test -Dtest=VetControllerTests,VetPdfGeneratorTests` — verify all existing tests still pass after JSP and message bundle changes

**Checkpoint**: All three user stories complete. Full feature is functional and internationalized.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, coverage verification, and final validation.

- [x] T015 Write `testShowPdfVetListEmpty()` in `VetControllerTests.java` — mock `clinicService.findVets()` returning empty list, verify `/vets.pdf` still returns status 200 with valid PDF content (FR-010)
- [x] T016 Run full test suite and coverage report with `./mvnw.cmd verify` — verify all tests pass across JDK 17, check JaCoCo report at `target/site/jacoco/index.html` for `VetPdfGenerator` (≥ 80% lines, ≥ 75% branches) and `VetController` (no regression)
- [x] T017 Run quickstart.md validation: start app with `./mvnw.cmd jetty:run-war`, manually verify all scenarios from `specs/002-export-vets-pdf/quickstart.md` (PDF download, logo in header, i18n labels, empty list behavior)
- [x] T018 Commit all changes with message `feat: add PDF export for veterinarians list (#002)` following Conventional Commits convention

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: N/A — no foundational tasks
- **User Story 1 (Phase 3)**: Depends on Phase 1 (OpenPDF in classpath)
- **User Story 2 (Phase 4)**: Depends on Phase 3 (VetPdfGenerator exists to enhance)
- **User Story 3 (Phase 5)**: Depends on Phase 3 (endpoint exists to link to)
- **Polish (Phase 6)**: Depends on Phase 3, 4, and 5

### User Story Dependencies

- **US1 (P1)**: Depends only on Setup. Creates VetPdfGenerator + endpoint. **MVP deliverable.**
- **US2 (P2)**: Depends on US1 — enhances VetPdfGenerator with header/logo. Can be developed right after US1.
- **US3 (P3)**: Depends on US1 — links to `/vets.pdf` endpoint. **Can run in parallel with US2** (different files: JSP + messages vs. VetPdfGenerator).

### Within Each User Story

1. Tests written FIRST → must FAIL (RED)
2. Implementation → tests PASS (GREEN)
3. Refactor if needed
4. Run test suite to confirm no regressions

### Parallel Opportunities

- **T003 + T004**: Both test methods in same file, but write sequentially
- **US2 + US3**: Can proceed in parallel after US1 completes (US2 modifies VetPdfGenerator.java; US3 modifies vetList.jsp + messages — no file conflicts)
- **T012**: i18n message files [P] — four independent files, can be edited in one pass

---

## Parallel Example: After US1 Completes

```text
# Developer A (US2 — branding):
T008: Write testPdfContainsHeaderContent() in VetControllerTests.java
T009: Write testPdfGeneratesWithoutLogo() in VetPdfGeneratorTests.java
T010: Enhance VetPdfGenerator with logo/title/date/footer
T011: Run US2 tests

# Developer B (US3 — UI/i18n) — in parallel:
T012: Add exportPdf key to all message bundles
T013: Add PDF link in vetList.jsp
T014: Run regression tests
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Add OpenPDF to pom.xml
2. Complete Phase 3: Create VetPdfGenerator + endpoint + tests
3. **STOP and VALIDATE**: `GET /vets.pdf` downloads a valid PDF with vet table
4. Deploy/demo if ready — basic PDF export is fully functional

### Incremental Delivery

1. Phase 1 (Setup) → OpenPDF available
2. Phase 3 (US1) → PDF download works → **MVP!**
3. Phase 4 (US2) → Logo + branding in PDF header
4. Phase 5 (US3) → Export button visible on page with i18n
5. Phase 6 (Polish) → Edge cases, coverage, final validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Constitution Principle IV mandates JaCoCo ≥ 80% lines / ≥ 75% branches
- Constitution Principle V mandates SLF4J logging in all new classes
- Constitution Principle VI mandates i18n in all 4 message bundles
- The existing `SimpleMappingExceptionResolver` handles PDF generation errors (FR-011) — no custom error handling needed
- `ClinicService.findVets()` is `@Cacheable("vets")` — PDF endpoint benefits from the same cache
