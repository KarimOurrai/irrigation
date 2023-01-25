package com.karim.irrigation.service;

import com.karim.irrigation.domain.TimeSlot;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link TimeSlot}.
 */
public interface TimeSlotService {
    /**
     * Save a timeSlot.
     *
     * @param timeSlot the entity to save.
     * @return the persisted entity.
     */
    TimeSlot save(TimeSlot timeSlot);

    /**
     * Updates a timeSlot.
     *
     * @param timeSlot the entity to update.
     * @return the persisted entity.
     */
    TimeSlot update(TimeSlot timeSlot);

    /**
     * Partially updates a timeSlot.
     *
     * @param timeSlot the entity to update partially.
     * @return the persisted entity.
     */
    Optional<TimeSlot> partialUpdate(TimeSlot timeSlot);

    /**
     * Get all the timeSlots.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<TimeSlot> findAll(Pageable pageable);

    /**
     * Get the "id" timeSlot.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<TimeSlot> findOne(Long id);

    /**
     * Delete the "id" timeSlot.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
