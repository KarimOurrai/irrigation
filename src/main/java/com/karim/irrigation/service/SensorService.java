package com.karim.irrigation.service;

import com.karim.irrigation.domain.Sensor;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Sensor}.
 */
public interface SensorService {
    /**
     * Save a sensor.
     *
     * @param sensor the entity to save.
     * @return the persisted entity.
     */
    Sensor save(Sensor sensor);

    /**
     * Updates a sensor.
     *
     * @param sensor the entity to update.
     * @return the persisted entity.
     */
    Sensor update(Sensor sensor);

    /**
     * Partially updates a sensor.
     *
     * @param sensor the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Sensor> partialUpdate(Sensor sensor);

    /**
     * Get all the sensors.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Sensor> findAll(Pageable pageable);

    /**
     * Get the "id" sensor.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Sensor> findOne(Long id);

    /**
     * Delete the "id" sensor.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
