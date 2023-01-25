package com.karim.irrigation.service;

import com.karim.irrigation.domain.Crop;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Crop}.
 */
public interface CropService {
    /**
     * Save a crop.
     *
     * @param crop the entity to save.
     * @return the persisted entity.
     */
    Crop save(Crop crop);

    /**
     * Updates a crop.
     *
     * @param crop the entity to update.
     * @return the persisted entity.
     */
    Crop update(Crop crop);

    /**
     * Partially updates a crop.
     *
     * @param crop the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Crop> partialUpdate(Crop crop);

    /**
     * Get all the crops.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Crop> findAll(Pageable pageable);

    /**
     * Get the "id" crop.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Crop> findOne(Long id);

    /**
     * Delete the "id" crop.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
