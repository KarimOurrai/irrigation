package com.karim.irrigation.repository;

import com.karim.irrigation.domain.Plot;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Plot entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlotRepository extends JpaRepository<Plot, Long> {}
