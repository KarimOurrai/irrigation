package com.karim.irrigation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.karim.irrigation.IntegrationTest;
import com.karim.irrigation.domain.TimeSlot;
import com.karim.irrigation.repository.TimeSlotRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link TimeSlotResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TimeSlotResourceIT {

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_STATUS = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_STATUS = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Double DEFAULT_WATER_AMOUNT = 1D;
    private static final Double UPDATED_WATER_AMOUNT = 2D;

    private static final String ENTITY_API_URL = "/api/time-slots";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTimeSlotMockMvc;

    private TimeSlot timeSlot;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimeSlot createEntity(EntityManager em) {
        TimeSlot timeSlot = new TimeSlot()
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME)
            .status(DEFAULT_STATUS)
            .waterAmount(DEFAULT_WATER_AMOUNT);
        return timeSlot;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimeSlot createUpdatedEntity(EntityManager em) {
        TimeSlot timeSlot = new TimeSlot()
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .status(UPDATED_STATUS)
            .waterAmount(UPDATED_WATER_AMOUNT);
        return timeSlot;
    }

    @BeforeEach
    public void initTest() {
        timeSlot = createEntity(em);
    }

    @Test
    @Transactional
    void createTimeSlot() throws Exception {
        int databaseSizeBeforeCreate = timeSlotRepository.findAll().size();
        // Create the TimeSlot
        restTimeSlotMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timeSlot))
            )
            .andExpect(status().isCreated());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeCreate + 1);
        TimeSlot testTimeSlot = timeSlotList.get(timeSlotList.size() - 1);
        assertThat(testTimeSlot.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testTimeSlot.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testTimeSlot.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testTimeSlot.getWaterAmount()).isEqualTo(DEFAULT_WATER_AMOUNT);
    }

    @Test
    @Transactional
    void createTimeSlotWithExistingId() throws Exception {
        // Create the TimeSlot with an existing ID
        timeSlot.setId(1L);

        int databaseSizeBeforeCreate = timeSlotRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimeSlotMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timeSlot))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTimeSlots() throws Exception {
        // Initialize the database
        timeSlotRepository.saveAndFlush(timeSlot);

        // Get all the timeSlotList
        restTimeSlotMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(timeSlot.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].waterAmount").value(hasItem(DEFAULT_WATER_AMOUNT.doubleValue())));
    }

    @Test
    @Transactional
    void getTimeSlot() throws Exception {
        // Initialize the database
        timeSlotRepository.saveAndFlush(timeSlot);

        // Get the timeSlot
        restTimeSlotMockMvc
            .perform(get(ENTITY_API_URL_ID, timeSlot.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(timeSlot.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.waterAmount").value(DEFAULT_WATER_AMOUNT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingTimeSlot() throws Exception {
        // Get the timeSlot
        restTimeSlotMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTimeSlot() throws Exception {
        // Initialize the database
        timeSlotRepository.saveAndFlush(timeSlot);

        int databaseSizeBeforeUpdate = timeSlotRepository.findAll().size();

        // Update the timeSlot
        TimeSlot updatedTimeSlot = timeSlotRepository.findById(timeSlot.getId()).get();
        // Disconnect from session so that the updates on updatedTimeSlot are not directly saved in db
        em.detach(updatedTimeSlot);
        updatedTimeSlot.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).status(UPDATED_STATUS).waterAmount(UPDATED_WATER_AMOUNT);

        restTimeSlotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTimeSlot.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTimeSlot))
            )
            .andExpect(status().isOk());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeUpdate);
        TimeSlot testTimeSlot = timeSlotList.get(timeSlotList.size() - 1);
        assertThat(testTimeSlot.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testTimeSlot.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testTimeSlot.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTimeSlot.getWaterAmount()).isEqualTo(UPDATED_WATER_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingTimeSlot() throws Exception {
        int databaseSizeBeforeUpdate = timeSlotRepository.findAll().size();
        timeSlot.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimeSlotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, timeSlot.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timeSlot))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTimeSlot() throws Exception {
        int databaseSizeBeforeUpdate = timeSlotRepository.findAll().size();
        timeSlot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeSlotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timeSlot))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTimeSlot() throws Exception {
        int databaseSizeBeforeUpdate = timeSlotRepository.findAll().size();
        timeSlot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeSlotMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timeSlot))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTimeSlotWithPatch() throws Exception {
        // Initialize the database
        timeSlotRepository.saveAndFlush(timeSlot);

        int databaseSizeBeforeUpdate = timeSlotRepository.findAll().size();

        // Update the timeSlot using partial update
        TimeSlot partialUpdatedTimeSlot = new TimeSlot();
        partialUpdatedTimeSlot.setId(timeSlot.getId());

        partialUpdatedTimeSlot.startTime(UPDATED_START_TIME).status(UPDATED_STATUS).waterAmount(UPDATED_WATER_AMOUNT);

        restTimeSlotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimeSlot.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimeSlot))
            )
            .andExpect(status().isOk());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeUpdate);
        TimeSlot testTimeSlot = timeSlotList.get(timeSlotList.size() - 1);
        assertThat(testTimeSlot.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testTimeSlot.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testTimeSlot.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTimeSlot.getWaterAmount()).isEqualTo(UPDATED_WATER_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdateTimeSlotWithPatch() throws Exception {
        // Initialize the database
        timeSlotRepository.saveAndFlush(timeSlot);

        int databaseSizeBeforeUpdate = timeSlotRepository.findAll().size();

        // Update the timeSlot using partial update
        TimeSlot partialUpdatedTimeSlot = new TimeSlot();
        partialUpdatedTimeSlot.setId(timeSlot.getId());

        partialUpdatedTimeSlot
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .status(UPDATED_STATUS)
            .waterAmount(UPDATED_WATER_AMOUNT);

        restTimeSlotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimeSlot.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimeSlot))
            )
            .andExpect(status().isOk());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeUpdate);
        TimeSlot testTimeSlot = timeSlotList.get(timeSlotList.size() - 1);
        assertThat(testTimeSlot.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testTimeSlot.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testTimeSlot.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTimeSlot.getWaterAmount()).isEqualTo(UPDATED_WATER_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingTimeSlot() throws Exception {
        int databaseSizeBeforeUpdate = timeSlotRepository.findAll().size();
        timeSlot.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimeSlotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, timeSlot.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timeSlot))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTimeSlot() throws Exception {
        int databaseSizeBeforeUpdate = timeSlotRepository.findAll().size();
        timeSlot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeSlotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timeSlot))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTimeSlot() throws Exception {
        int databaseSizeBeforeUpdate = timeSlotRepository.findAll().size();
        timeSlot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeSlotMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timeSlot))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TimeSlot in the database
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTimeSlot() throws Exception {
        // Initialize the database
        timeSlotRepository.saveAndFlush(timeSlot);

        int databaseSizeBeforeDelete = timeSlotRepository.findAll().size();

        // Delete the timeSlot
        restTimeSlotMockMvc
            .perform(delete(ENTITY_API_URL_ID, timeSlot.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TimeSlot> timeSlotList = timeSlotRepository.findAll();
        assertThat(timeSlotList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
