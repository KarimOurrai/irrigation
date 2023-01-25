package com.karim.irrigation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.karim.irrigation.IntegrationTest;
import com.karim.irrigation.domain.Crop;
import com.karim.irrigation.repository.CropRepository;
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
 * Integration tests for the {@link CropResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CropResourceIT {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final Double DEFAULT_WATER_AMOUNT = 1D;
    private static final Double UPDATED_WATER_AMOUNT = 2D;

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    private static final Double DEFAULT_AREA = 1D;
    private static final Double UPDATED_AREA = 2D;

    private static final String ENTITY_API_URL = "/api/crops";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCropMockMvc;

    private Crop crop;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Crop createEntity(EntityManager em) {
        Crop crop = new Crop().type(DEFAULT_TYPE).waterAmount(DEFAULT_WATER_AMOUNT).duration(DEFAULT_DURATION).area(DEFAULT_AREA);
        return crop;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Crop createUpdatedEntity(EntityManager em) {
        Crop crop = new Crop().type(UPDATED_TYPE).waterAmount(UPDATED_WATER_AMOUNT).duration(UPDATED_DURATION).area(UPDATED_AREA);
        return crop;
    }

    @BeforeEach
    public void initTest() {
        crop = createEntity(em);
    }

    @Test
    @Transactional
    void createCrop() throws Exception {
        int databaseSizeBeforeCreate = cropRepository.findAll().size();
        // Create the Crop
        restCropMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crop))
            )
            .andExpect(status().isCreated());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeCreate + 1);
        Crop testCrop = cropList.get(cropList.size() - 1);
        assertThat(testCrop.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testCrop.getWaterAmount()).isEqualTo(DEFAULT_WATER_AMOUNT);
        assertThat(testCrop.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testCrop.getArea()).isEqualTo(DEFAULT_AREA);
    }

    @Test
    @Transactional
    void createCropWithExistingId() throws Exception {
        // Create the Crop with an existing ID
        crop.setId(1L);

        int databaseSizeBeforeCreate = cropRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCropMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = cropRepository.findAll().size();
        // set the field null
        crop.setType(null);

        // Create the Crop, which fails.

        restCropMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crop))
            )
            .andExpect(status().isBadRequest());

        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCrops() throws Exception {
        // Initialize the database
        cropRepository.saveAndFlush(crop);

        // Get all the cropList
        restCropMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(crop.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].waterAmount").value(hasItem(DEFAULT_WATER_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].area").value(hasItem(DEFAULT_AREA.doubleValue())));
    }

    @Test
    @Transactional
    void getCrop() throws Exception {
        // Initialize the database
        cropRepository.saveAndFlush(crop);

        // Get the crop
        restCropMockMvc
            .perform(get(ENTITY_API_URL_ID, crop.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(crop.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.waterAmount").value(DEFAULT_WATER_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION))
            .andExpect(jsonPath("$.area").value(DEFAULT_AREA.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingCrop() throws Exception {
        // Get the crop
        restCropMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCrop() throws Exception {
        // Initialize the database
        cropRepository.saveAndFlush(crop);

        int databaseSizeBeforeUpdate = cropRepository.findAll().size();

        // Update the crop
        Crop updatedCrop = cropRepository.findById(crop.getId()).get();
        // Disconnect from session so that the updates on updatedCrop are not directly saved in db
        em.detach(updatedCrop);
        updatedCrop.type(UPDATED_TYPE).waterAmount(UPDATED_WATER_AMOUNT).duration(UPDATED_DURATION).area(UPDATED_AREA);

        restCropMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCrop.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCrop))
            )
            .andExpect(status().isOk());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeUpdate);
        Crop testCrop = cropList.get(cropList.size() - 1);
        assertThat(testCrop.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testCrop.getWaterAmount()).isEqualTo(UPDATED_WATER_AMOUNT);
        assertThat(testCrop.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testCrop.getArea()).isEqualTo(UPDATED_AREA);
    }

    @Test
    @Transactional
    void putNonExistingCrop() throws Exception {
        int databaseSizeBeforeUpdate = cropRepository.findAll().size();
        crop.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCropMockMvc
            .perform(
                put(ENTITY_API_URL_ID, crop.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(crop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCrop() throws Exception {
        int databaseSizeBeforeUpdate = cropRepository.findAll().size();
        crop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCropMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(crop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCrop() throws Exception {
        int databaseSizeBeforeUpdate = cropRepository.findAll().size();
        crop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCropMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crop))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCropWithPatch() throws Exception {
        // Initialize the database
        cropRepository.saveAndFlush(crop);

        int databaseSizeBeforeUpdate = cropRepository.findAll().size();

        // Update the crop using partial update
        Crop partialUpdatedCrop = new Crop();
        partialUpdatedCrop.setId(crop.getId());

        partialUpdatedCrop.waterAmount(UPDATED_WATER_AMOUNT).duration(UPDATED_DURATION).area(UPDATED_AREA);

        restCropMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCrop.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCrop))
            )
            .andExpect(status().isOk());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeUpdate);
        Crop testCrop = cropList.get(cropList.size() - 1);
        assertThat(testCrop.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testCrop.getWaterAmount()).isEqualTo(UPDATED_WATER_AMOUNT);
        assertThat(testCrop.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testCrop.getArea()).isEqualTo(UPDATED_AREA);
    }

    @Test
    @Transactional
    void fullUpdateCropWithPatch() throws Exception {
        // Initialize the database
        cropRepository.saveAndFlush(crop);

        int databaseSizeBeforeUpdate = cropRepository.findAll().size();

        // Update the crop using partial update
        Crop partialUpdatedCrop = new Crop();
        partialUpdatedCrop.setId(crop.getId());

        partialUpdatedCrop.type(UPDATED_TYPE).waterAmount(UPDATED_WATER_AMOUNT).duration(UPDATED_DURATION).area(UPDATED_AREA);

        restCropMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCrop.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCrop))
            )
            .andExpect(status().isOk());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeUpdate);
        Crop testCrop = cropList.get(cropList.size() - 1);
        assertThat(testCrop.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testCrop.getWaterAmount()).isEqualTo(UPDATED_WATER_AMOUNT);
        assertThat(testCrop.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testCrop.getArea()).isEqualTo(UPDATED_AREA);
    }

    @Test
    @Transactional
    void patchNonExistingCrop() throws Exception {
        int databaseSizeBeforeUpdate = cropRepository.findAll().size();
        crop.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCropMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, crop.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(crop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCrop() throws Exception {
        int databaseSizeBeforeUpdate = cropRepository.findAll().size();
        crop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCropMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(crop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCrop() throws Exception {
        int databaseSizeBeforeUpdate = cropRepository.findAll().size();
        crop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCropMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(crop))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Crop in the database
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCrop() throws Exception {
        // Initialize the database
        cropRepository.saveAndFlush(crop);

        int databaseSizeBeforeDelete = cropRepository.findAll().size();

        // Delete the crop
        restCropMockMvc
            .perform(delete(ENTITY_API_URL_ID, crop.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Crop> cropList = cropRepository.findAll();
        assertThat(cropList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
