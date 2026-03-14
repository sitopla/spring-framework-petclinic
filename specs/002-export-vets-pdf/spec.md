# Feature Specification: Export Veterinarians List to PDF

**Feature Branch**: `002-export-vets-pdf`
**Created**: 2026-03-14
**Status**: Draft
**Input**: User description: "Añadir un botón en la vista de 'Veterinarios' que permita exportar la lista completa a un archivo PDF. El PDF debe incluir el nombre del veterinario y sus especialidades, con el logo de PetClinic en el encabezado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Download Vets List as PDF (Priority: P1)

As a clinic staff member viewing the veterinarians directory, I want to
click a button that downloads the complete list of veterinarians as a
PDF file so that I can print it, share it via email, or keep an offline
copy for reference.

The PDF document MUST contain a table listing every veterinarian's full
name and their specialties — the same data currently shown on the
veterinarians HTML page.

**Why this priority**: This is the core functionality — without the
button and the generated PDF the entire feature has no value.

**Independent Test**: Navigate to the veterinarians page, click the
"Export to PDF" button, and verify a valid PDF file is downloaded
containing a table with all veterinarian names and specialties matching
the data displayed on the HTML page.

**Acceptance Scenarios**:

1. **Given** the veterinarians page is displayed with at least one
   veterinarian in the list,
   **When** the user clicks the "Export to PDF" button,
   **Then** the browser downloads a file named `veterinarians.pdf`
   containing a table with columns "Name" and "Specialties" populated
   with all veterinarian records.

2. **Given** a veterinarian has no specialties assigned,
   **When** the PDF is generated,
   **Then** the specialties column for that veterinarian displays
   "none" (matching the existing HTML view behavior).

3. **Given** the veterinarians page is displayed,
   **When** the user clicks the "Export to PDF" button,
   **Then** the downloaded file is a valid PDF that opens correctly in
   any standard PDF reader (browser built-in viewer, Adobe Acrobat,
   macOS Preview).

4. **Given** the user clicks the export button,
   **When** the file download completes,
   **Then** the browser does NOT navigate away from the veterinarians
   page — the user remains on the same view.

---

### User Story 2 - PDF Header with PetClinic Logo (Priority: P2)

As a clinic manager, I want the exported PDF to include the PetClinic
logo in the header area along with a title and the generation date so
that the document looks professional and is suitable for sharing with
external stakeholders or regulatory bodies.

**Why this priority**: Branding and a professional appearance add
significant value for external-facing documents, but the PDF is still
useful without them.

**Independent Test**: Download the vets PDF and verify the top of the
document contains the PetClinic logo image, the title "Veterinarians",
and the current date.

**Acceptance Scenarios**:

1. **Given** the user downloads the vets PDF,
   **When** the document is opened,
   **Then** the header area displays the PetClinic logo (the existing
   Spring PetClinic brand image used in the application).

2. **Given** the user downloads the vets PDF,
   **When** the document is opened,
   **Then** the header area displays the title "Veterinarians" and the
   date of generation in ISO format (YYYY-MM-DD).

3. **Given** the logo image file is present in the application resources,
   **When** the PDF is generated,
   **Then** the logo is rendered clearly at an appropriate size that
   does not distort its aspect ratio and does not dominate the page.

---

### User Story 3 - UI Placement and Internationalization (Priority: P3)

As a clinic staff member, I want the PDF export button to appear in the
same area as the existing XML and JSON export links on the veterinarians
page, and I want the button label to be displayed in my preferred
language so the interface remains consistent and accessible.

**Why this priority**: UI consistency and i18n are important for a
polished experience but do not affect the core PDF generation.

**Independent Test**: Open the veterinarians page in each supported
locale and verify the export button appears alongside the XML/JSON
links with the correct translated label.

**Acceptance Scenarios**:

1. **Given** the veterinarians page is loaded,
   **When** the user looks at the export options area below the table,
   **Then** an "Export to PDF" button (or link styled consistently
   with the existing export links) is visible alongside the "View as
   XML" and "View as JSON" links.

2. **Given** the application is accessed in any of the four supported
   locales (default, English, German, Spanish),
   **When** the veterinarians page is displayed,
   **Then** the PDF export button label is shown in the correct
   language for that locale.

---

### Edge Cases

- What happens when the veterinarian list is empty (zero records)?
  The system MUST still generate a valid PDF containing the branded
  header and an empty table or a message indicating "No veterinarians
  found."
- What happens if a veterinarian has a very long name or many
  specialties? The PDF layout MUST handle text wrapping gracefully
  without truncating content.
- What happens if PDF generation fails on the server (e.g., out of
  memory or internal error)? The user MUST see a user-friendly error
  page — never a raw stack trace or exception.
- What happens if the logo image file is missing or corrupted? The
  PDF MUST still be generated with the title and date in the header,
  omitting the logo gracefully rather than failing entirely.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display an "Export to PDF" action on the
  veterinarians list page, placed alongside the existing XML and JSON
  export links.
- **FR-002**: The system MUST generate a PDF document containing a
  table with two columns: "Name" (first name + last name) and
  "Specialties".
- **FR-003**: The PDF table MUST include all veterinarians currently
  returned by the clinic service — the same dataset used by the HTML
  view, JSON, and XML endpoints.
- **FR-004**: Veterinarians with no specialties MUST display "none" in
  the specialties column, consistent with the existing HTML view.
- **FR-005**: The PDF MUST include a header section containing the
  PetClinic logo image, the title "Veterinarians", and the generation
  date in ISO format (YYYY-MM-DD).
- **FR-006**: If the logo image is unavailable, the PDF MUST still be
  generated with the title and date — the missing logo MUST NOT cause
  a generation failure.
- **FR-007**: The system MUST serve the PDF with a content-disposition
  attachment header to trigger a browser file download (not inline
  rendering).
- **FR-008**: The downloaded file MUST be named `veterinarians.pdf`.
- **FR-009**: The export button label MUST be internationalized using
  the application's existing message bundles for all supported
  locales: default, English (`en`), German (`de`), and Spanish (`es`).
- **FR-010**: If the veterinarian list is empty, the system MUST
  generate a valid PDF with the branded header and either an empty
  table or a "No veterinarians found" message.
- **FR-011**: If PDF generation fails due to a server error, the
  system MUST present a user-friendly error page — never a raw
  exception or stack trace.
- **FR-012**: The PDF page layout MUST use A4 portrait orientation.
- **FR-013**: The PDF table MUST handle long text (names, multiple
  specialties) with proper text wrapping — no content truncation.

### Key Entities

- **Vet**: A veterinarian with first name, last name, and a collection
  of specialties. Already exists in the domain model.
- **Specialty**: A medical specialization (e.g., radiology, surgery,
  dentistry) associated with one or more veterinarians. Already exists
  in the domain model.
- **Vets**: Wrapper object that aggregates the full list of
  veterinarians. Already exists and is used by the JSON/XML export
  endpoints.

### Assumptions

- The PDF is generated server-side, consistent with the project's
  server-rendered architecture (not client-side via JavaScript).
- The PDF export uses the same data source and caching as the existing
  HTML, JSON, and XML endpoints (via `ClinicService.findVets()`).
- No authentication or authorization is required for the PDF endpoint,
  matching the existing open-access behavior of all PetClinic
  endpoints.
- The PetClinic logo refers to the existing brand image available in
  the application's static resources directory
  (`spring-pivotal-logo.png`).
- Paper size defaults to A4 portrait; no user-selectable page options
  are required.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can download the complete veterinarians list as a
  PDF in a single click from the veterinarians page.
- **SC-002**: The downloaded PDF opens successfully in all major PDF
  readers without errors or warnings.
- **SC-003**: The PDF contains 100% of the veterinarian records shown
  on the HTML page — no missing or duplicated entries.
- **SC-004**: The PDF header displays the PetClinic logo, the title,
  and the generation date on every download.
- **SC-005**: The PDF export completes and the download begins within
  3 seconds for lists of up to 500 veterinarians.
- **SC-006**: The export button label is correctly translated in all
  four supported locales (default, en, de, es).
