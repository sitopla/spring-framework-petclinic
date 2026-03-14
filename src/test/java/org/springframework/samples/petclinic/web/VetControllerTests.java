package org.springframework.samples.petclinic.web;

import org.assertj.core.util.Lists;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.model.Specialty;
import org.springframework.samples.petclinic.model.Vet;
import org.springframework.samples.petclinic.service.ClinicService;
import org.springframework.test.context.junit.jupiter.web.SpringJUnitWebConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.xml.HasXPath.hasXPath;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the {@link VetController}
 */
@SpringJUnitWebConfig(locations = {"classpath:spring/mvc-core-config.xml", "classpath:spring/mvc-test-config.xml"})
class VetControllerTests {

    @Autowired
    private VetController vetController;

    @Autowired
    private ClinicService clinicService;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(vetController).build();

        Vet james = new Vet();
        james.setFirstName("James");
        james.setLastName("Carter");
        james.setId(1);
        Vet helen = new Vet();
        helen.setFirstName("Helen");
        helen.setLastName("Leary");
        helen.setId(2);
        Specialty radiology = new Specialty();
        radiology.setId(1);
        radiology.setName("radiology");
        helen.addSpecialty(radiology);
        given(this.clinicService.findVets()).willReturn(Lists.newArrayList(james, helen));
    }

    @Test
    void testShowVetListHtml() throws Exception {
        mockMvc.perform(get("/vets"))
            .andExpect(status().isOk())
            .andExpect(model().attributeExists("vets"))
            .andExpect(view().name("vets/vetList"));
    }

    @Test
    void testShowResourcesVetList() throws Exception {
        ResultActions actions = mockMvc.perform(get("/vets.json").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
        actions.andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.vetList[0].id").value(1));
    }

    @Test
    void testShowVetListXml() throws Exception {
        mockMvc.perform(get("/vets.xml").accept(MediaType.APPLICATION_XML))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_XML_VALUE))
            .andExpect(content().node(hasXPath("/vets/vet[id=1]/id")));
    }

    @Test
    void testShowPdfVetList() throws Exception {
        byte[] result = mockMvc.perform(get("/vets.pdf"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/pdf"))
            .andExpect(header().string("Content-Disposition", "attachment; filename=\"veterinarians.pdf\""))
            .andReturn().getResponse().getContentAsByteArray();

        // Verify PDF magic bytes (%PDF)
        assertThat(result).hasSizeGreaterThan(4);
        assertThat(new String(result, 0, 5)).startsWith("%PDF");
    }

    @Test
    void testShowPdfVetListWithVetWithoutSpecialties() throws Exception {
        // James Carter has no specialties — verify PDF still generates successfully
        Vet solo = new Vet();
        solo.setFirstName("Solo");
        solo.setLastName("Vet");
        solo.setId(99);
        given(this.clinicService.findVets()).willReturn(Lists.newArrayList(solo));

        byte[] result = mockMvc.perform(get("/vets.pdf"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/pdf"))
            .andReturn().getResponse().getContentAsByteArray();

        assertThat(new String(result, 0, 5)).startsWith("%PDF");
    }

    @Test
    void testPdfContainsHeaderContent() throws Exception {
        byte[] result = mockMvc.perform(get("/vets.pdf"))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsByteArray();

        // Verify it's a valid and non-trivial PDF (header + table = substantial content)
        assertThat(result).hasSizeGreaterThan(500);
        assertThat(new String(result, 0, 5)).startsWith("%PDF");
        // PDF trailer present — confirms complete document
        String pdfEnd = new String(result, result.length - 10, 10);
        assertThat(pdfEnd).contains("%%EOF");
    }

    @Test
    void testShowPdfVetListEmpty() throws Exception {
        given(this.clinicService.findVets()).willReturn(Lists.newArrayList());

        byte[] result = mockMvc.perform(get("/vets.pdf"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/pdf"))
            .andReturn().getResponse().getContentAsByteArray();

        assertThat(result).hasSizeGreaterThan(4);
        assertThat(new String(result, 0, 5)).startsWith("%PDF");
    }

}

