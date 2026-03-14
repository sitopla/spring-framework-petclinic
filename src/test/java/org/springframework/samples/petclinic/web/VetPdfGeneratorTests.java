package org.springframework.samples.petclinic.web;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockServletContext;
import org.springframework.samples.petclinic.model.Specialty;
import org.springframework.samples.petclinic.model.Vet;
import org.springframework.samples.petclinic.model.Vets;

import java.io.ByteArrayOutputStream;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link VetPdfGenerator}.
 * Tests PDF generation in isolation without a full Spring context.
 */
class VetPdfGeneratorTests {

	/**
	 * FR-006: When the logo is unavailable, the PDF must still be generated
	 * successfully without it.
	 */
	@Test
	void testPdfGeneratesWithoutLogo() throws Exception {
		// MockServletContext returns null for non-registered resources
		MockServletContext mockCtx = new MockServletContext();
		VetPdfGenerator generator = new VetPdfGenerator(mockCtx);

		Vets vets = new Vets();
		Vet vet = new Vet();
		vet.setFirstName("James");
		vet.setLastName("Carter");
		vet.setId(1);
		Specialty radiology = new Specialty();
		radiology.setId(1);
		radiology.setName("radiology");
		vet.addSpecialty(radiology);
		vets.getVetList().add(vet);

		ByteArrayOutputStream out = new ByteArrayOutputStream();
		generator.generate(vets, out);

		byte[] pdf = out.toByteArray();
		assertThat(pdf).hasSizeGreaterThan(4);
		assertThat(new String(pdf, 0, 5)).startsWith("%PDF");
	}

	@Test
	void testPdfWithEmptyVetList() throws Exception {
		MockServletContext mockCtx = new MockServletContext();
		VetPdfGenerator generator = new VetPdfGenerator(mockCtx);

		Vets vets = new Vets();
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		generator.generate(vets, out);

		byte[] pdf = out.toByteArray();
		assertThat(pdf).hasSizeGreaterThan(4);
		assertThat(new String(pdf, 0, 5)).startsWith("%PDF");
	}
}
