package com.karim.irrigation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.karim.irrigation.IntegrationTest;
import com.karim.irrigation.domain.Plot;
import com.karim.irrigation.repository.PlotRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PlotResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlotResourceIT {

    private static final Long DEFAULT_CULTIVATED_AREA = 1L;
    private static final Long UPDATED_CULTIVATED_AREA = 2L;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/plots";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PlotRepository plotRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlotMockMvc;

    private Plot plot;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plot createEntity(EntityManager em) {
        Plot plot = new Plot().cultivatedArea(DEFAULT_CULTIVATED_AREA).name(DEFAULT_NAME).location(DEFAULT_LOCATION);
        return plot;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plot createUpdatedEntity(EntityManager em) {
        Plot plot = new Plot().cultivatedArea(UPDATED_CULTIVATED_AREA).name(UPDATED_NAME).location(UPDATED_LOCATION);
        return plot;
    }

    @BeforeEach
    public void initTest() {
        plot = createEntity(em);
    }

    @Test
    @Transactional
    void createPlot() throws Exception {
        int databaseSizeBeforeCreate = plotRepository.findAll().size();
        // Create the Plot
        restPlotMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plot))
            )
            .andExpect(status().isCreated());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeCreate + 1);
        Plot testPlot = plotList.get(plotList.size() - 1);
        assertThat(testPlot.getCultivatedArea()).isEqualTo(DEFAULT_CULTIVATED_AREA);
        assertThat(testPlot.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPlot.getLocation()).isEqualTo(DEFAULT_LOCATION);
    }

    @Test
    @Transactional
    void createPlotWithExistingId() throws Exception {
        // Create the Plot with an existing ID
        plot.setId(1L);

        int databaseSizeBeforeCreate = plotRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlotMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plot))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlots() throws Exception {
        // Initialize the database
        plotRepository.saveAndFlush(plot);

        // Get all the plotList
        restPlotMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plot.getId().intValue())))
            .andExpect(jsonPath("$.[*].cultivatedArea").value(hasItem(DEFAULT_CULTIVATED_AREA.intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)));
    }

    @Test
    @Transactional
    void getPlot() throws Exception {
        // Initialize the database
        plotRepository.saveAndFlush(plot);

        // Get the plot
        restPlotMockMvc
            .perform(get(ENTITY_API_URL_ID, plot.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(plot.getId().intValue()))
            .andExpect(jsonPath("$.cultivatedArea").value(DEFAULT_CULTIVATED_AREA.intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION));
    }

    @Test
    @Transactional
    void getNonExistingPlot() throws Exception {
        // Get the plot
        restPlotMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlot() throws Exception {
        // Initialize the database
        plotRepository.saveAndFlush(plot);

        int databaseSizeBeforeUpdate = plotRepository.findAll().size();

        // Update the plot
        Plot updatedPlot = plotRepository.findById(plot.getId()).get();
        // Disconnect from session so that the updates on updatedPlot are not directly saved in db
        em.detach(updatedPlot);
        updatedPlot.cultivatedArea(UPDATED_CULTIVATED_AREA).name(UPDATED_NAME).location(UPDATED_LOCATION);

        restPlotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlot.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPlot))
            )
            .andExpect(status().isOk());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeUpdate);
        Plot testPlot = plotList.get(plotList.size() - 1);
        assertThat(testPlot.getCultivatedArea()).isEqualTo(UPDATED_CULTIVATED_AREA);
        assertThat(testPlot.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPlot.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void putNonExistingPlot() throws Exception {
        int databaseSizeBeforeUpdate = plotRepository.findAll().size();
        plot.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, plot.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plot))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlot() throws Exception {
        int databaseSizeBeforeUpdate = plotRepository.findAll().size();
        plot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plot))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlot() throws Exception {
        int databaseSizeBeforeUpdate = plotRepository.findAll().size();
        plot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlotMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plot))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlotWithPatch() throws Exception {
        // Initialize the database
        plotRepository.saveAndFlush(plot);

        int databaseSizeBeforeUpdate = plotRepository.findAll().size();

        // Update the plot using partial update
        Plot partialUpdatedPlot = new Plot();
        partialUpdatedPlot.setId(plot.getId());

        restPlotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlot.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlot))
            )
            .andExpect(status().isOk());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeUpdate);
        Plot testPlot = plotList.get(plotList.size() - 1);
        assertThat(testPlot.getCultivatedArea()).isEqualTo(DEFAULT_CULTIVATED_AREA);
        assertThat(testPlot.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPlot.getLocation()).isEqualTo(DEFAULT_LOCATION);
    }

    @Test
    @Transactional
    void fullUpdatePlotWithPatch() throws Exception {
        // Initialize the database
        plotRepository.saveAndFlush(plot);

        int databaseSizeBeforeUpdate = plotRepository.findAll().size();

        // Update the plot using partial update
        Plot partialUpdatedPlot = new Plot();
        partialUpdatedPlot.setId(plot.getId());

        partialUpdatedPlot.cultivatedArea(UPDATED_CULTIVATED_AREA).name(UPDATED_NAME).location(UPDATED_LOCATION);

        restPlotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlot.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlot))
            )
            .andExpect(status().isOk());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeUpdate);
        Plot testPlot = plotList.get(plotList.size() - 1);
        assertThat(testPlot.getCultivatedArea()).isEqualTo(UPDATED_CULTIVATED_AREA);
        assertThat(testPlot.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPlot.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void patchNonExistingPlot() throws Exception {
        int databaseSizeBeforeUpdate = plotRepository.findAll().size();
        plot.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, plot.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plot))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlot() throws Exception {
        int databaseSizeBeforeUpdate = plotRepository.findAll().size();
        plot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plot))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlot() throws Exception {
        int databaseSizeBeforeUpdate = plotRepository.findAll().size();
        plot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlotMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plot))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plot in the database
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlot() throws Exception {
        // Initialize the database
        plotRepository.saveAndFlush(plot);

        int databaseSizeBeforeDelete = plotRepository.findAll().size();

        // Delete the plot
        restPlotMockMvc
            .perform(delete(ENTITY_API_URL_ID, plot.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Plot> plotList = plotRepository.findAll();
        assertThat(plotList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
