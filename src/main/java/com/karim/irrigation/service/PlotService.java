package com.karim.irrigation.service;

import com.karim.irrigation.domain.Plot;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Plot}.
 */
public interface PlotService {
    /**
     * Save a plot.
     *
     * @param plot the entity to save.
     * @return the persisted entity.
     */
    Plot save(Plot plot);

    /**
     * Updates a plot.
     *
     * @param plot the entity to update.
     * @return the persisted entity.
     */
    Plot update(Plot plot);

    /**
     * Partially updates a plot.
     *
     * @param plot the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Plot> partialUpdate(Plot plot);

    /**
     * Get all the plots.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Plot> findAll(Pageable pageable);

    /**
     * Get the "id" plot.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Plot> findOne(Long id);

    /**
     * Delete the "id" plot.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
