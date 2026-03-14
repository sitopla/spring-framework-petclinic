/*
 * Copyright 2002-2026 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.samples.petclinic.web;

import org.openpdf.text.Document;
import org.openpdf.text.DocumentException;
import org.openpdf.text.Element;
import org.openpdf.text.Font;
import org.openpdf.text.FontFactory;
import org.openpdf.text.Image;
import org.openpdf.text.PageSize;
import org.openpdf.text.Paragraph;
import org.openpdf.text.Phrase;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfPageEventHelper;
import org.openpdf.text.pdf.PdfWriter;
import jakarta.servlet.ServletContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.model.Vet;
import org.springframework.samples.petclinic.model.Vets;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.time.LocalDate;
import java.util.stream.Collectors;

/**
 * Generates a PDF document listing all veterinarians and their specialties.
 * The PDF includes a branded header with the PetClinic logo, title, and generation date,
 * followed by a two-column table and page numbers in the footer.
 *
 * @author PetClinic Contributors
 */
@Component
public class VetPdfGenerator {

	private static final Logger log = LoggerFactory.getLogger(VetPdfGenerator.class);

	private static final String LOGO_PATH = "/resources/images/spring-pivotal-logo.png";
	private static final float LOGO_MAX_WIDTH = 120f;
	private static final float[] COLUMN_WIDTHS = { 60f, 40f };
	private static final float CELL_PADDING = 5f;

	private static final Font TITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
	private static final Font DATE_FONT = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.GRAY);
	private static final Font HEADER_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
	private static final Font BODY_FONT = FontFactory.getFont(FontFactory.HELVETICA, 11);

	private static final Color HEADER_BG = new Color(52, 58, 64);

	private final ServletContext servletContext;

	@Autowired
	public VetPdfGenerator(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	/**
	 * Generates a PDF document containing the list of veterinarians.
	 *
	 * @param vets the veterinarians data wrapper
	 * @param out  the output stream to write the PDF to
	 */
	public void generate(Vets vets, OutputStream out) {
		log.info("Generating PDF for {} veterinarian(s)", vets.getVetList().size());

		Document document = new Document(PageSize.A4);
		try {
			PdfWriter writer = PdfWriter.getInstance(document, out);
			writer.setPageEvent(new PageFooterEventHandler());
			document.open();

			addHeader(document);
			addVetTable(document, vets);

			document.close();
			log.info("PDF generated successfully");
		}
		catch (DocumentException ex) {
			log.error("Failed to generate veterinarians PDF", ex);
			throw new PdfGenerationException("Failed to generate veterinarians PDF", ex);
		}
	}

	private void addHeader(Document document) throws DocumentException {
		PdfPTable headerTable = new PdfPTable(2);
		headerTable.setWidthPercentage(100);
		headerTable.setWidths(new float[] { 30f, 70f });

		// Logo cell
		PdfPCell logoCell = new PdfPCell();
		logoCell.setBorder(PdfPCell.NO_BORDER);
		logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
		try {
			Image logo = loadLogo();
			if (logo != null) {
				logo.scaleToFit(LOGO_MAX_WIDTH, LOGO_MAX_WIDTH);
				logoCell.addElement(logo);
			}
		}
		catch (Exception ex) {
			log.warn("Could not load PetClinic logo — PDF will be generated without it", ex);
		}
		headerTable.addCell(logoCell);

		// Title and date cell
		PdfPCell titleCell = new PdfPCell();
		titleCell.setBorder(PdfPCell.NO_BORDER);
		titleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
		titleCell.addElement(new Paragraph("Veterinarians", TITLE_FONT));
		titleCell.addElement(new Paragraph(LocalDate.now().toString(), DATE_FONT));
		headerTable.addCell(titleCell);

		document.add(headerTable);
		document.add(new Paragraph(" "));
	}

	private Image loadLogo() {
		try (InputStream logoStream = servletContext.getResourceAsStream(LOGO_PATH)) {
			if (logoStream == null) {
				log.warn("Logo not found at path: {}", LOGO_PATH);
				return null;
			}
			byte[] logoBytes = logoStream.readAllBytes();
			return Image.getInstance(logoBytes);
		}
		catch (IOException | DocumentException ex) {
			log.warn("Failed to load logo image", ex);
			return null;
		}
	}

	private void addVetTable(Document document, Vets vets) throws DocumentException {
		PdfPTable table = new PdfPTable(COLUMN_WIDTHS.length);
		table.setWidthPercentage(100);
		table.setWidths(COLUMN_WIDTHS);

		addTableHeader(table);

		if (vets.getVetList().isEmpty()) {
			PdfPCell emptyCell = new PdfPCell(new Phrase("No veterinarians found", BODY_FONT));
			emptyCell.setColspan(2);
			emptyCell.setPadding(CELL_PADDING);
			emptyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
			table.addCell(emptyCell);
		}
		else {
			for (Vet vet : vets.getVetList()) {
				addVetRow(table, vet);
			}
		}

		document.add(table);
	}

	private void addTableHeader(PdfPTable table) {
		for (String header : new String[] { "Name", "Specialties" }) {
			PdfPCell cell = new PdfPCell(new Phrase(header, HEADER_FONT));
			cell.setBackgroundColor(HEADER_BG);
			cell.setPadding(CELL_PADDING);
			table.addCell(cell);
		}
	}

	private void addVetRow(PdfPTable table, Vet vet) {
		String name = vet.getFirstName() + " " + vet.getLastName();
		String specialties = vet.getNrOfSpecialties() == 0
			? "none"
			: vet.getSpecialties().stream()
				.map(s -> s.getName())
				.collect(Collectors.joining(" "));

		PdfPCell nameCell = new PdfPCell(new Phrase(name, BODY_FONT));
		nameCell.setPadding(CELL_PADDING);
		table.addCell(nameCell);

		PdfPCell specCell = new PdfPCell(new Phrase(specialties, BODY_FONT));
		specCell.setPadding(CELL_PADDING);
		table.addCell(specCell);
	}

	/**
	 * Page event handler that adds "Page X of Y" footer to every page.
	 */
	private static class PageFooterEventHandler extends PdfPageEventHelper {

		private static final Font FOOTER_FONT = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY);

		@Override
		public void onEndPage(PdfWriter writer, Document document) {
			PdfPTable footer = new PdfPTable(1);
			footer.setTotalWidth(document.getPageSize().getWidth() - document.leftMargin() - document.rightMargin());

			PdfPCell cell = new PdfPCell(
				new Phrase("Page " + writer.getPageNumber(), FOOTER_FONT));
			cell.setHorizontalAlignment(Element.ALIGN_CENTER);
			cell.setBorder(PdfPCell.NO_BORDER);
			footer.addCell(cell);

			footer.writeSelectedRows(0, -1,
				document.leftMargin(),
				document.bottomMargin() - 5,
				writer.getDirectContent());
		}
	}

	/**
	 * Runtime exception indicating a failure during PDF generation.
	 */
	public static class PdfGenerationException extends RuntimeException {
		public PdfGenerationException(String message, Throwable cause) {
			super(message, cause);
		}
	}

}
