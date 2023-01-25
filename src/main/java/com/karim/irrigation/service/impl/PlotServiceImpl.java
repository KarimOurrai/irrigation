package com.karim.irrigation.service.impl;

import com.karim.irrigation.domain.Plot;
import com.karim.irrigation.repository.PlotRepository;
import com.karim.irrigation.service.PlotService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Plot}.
 */
@Service
@Transactional
public class PlotServiceImpl implements PlotService {

    private final Logger log = LoggerFactory.getLogger(PlotServiceImpl.class);

    private final PlotRepository plotRepository;

    public PlotServiceImpl(PlotRepository plotRepository) {
        this.plotRepository = plotRepository;
    }

    @Override
    public Plot save(Plot plot) {
        log.debug("Request to save Plot : {}", plot);
        return plotRepository.save(plot);
    }

    @Override
    public Plot update(Plot plot) {
        log.debug("Request to update Plot : {}", plot);
        return plotRepository.save(plot);
    }

    @Override
    public Optional<Plot> partialUpdate(Plot plot) {
        log.debug("Request to partially update Plot : {}", plot);

        return plotRepository
            .findById(plot.getId())
            .map(existingPlot -> {
                if (plot.getCultivatedArea() != null) {
                    existingPlot.setCultivatedArea(plot.getCultivatedArea());
                }
                if (plot.getName() != null) {
                    existingPlot.setName(plot.getName());
                }
                if (plot.getLocation() != null) {
                    existingPlot.setLocation(plot.getLocation());
                }

                return existingPlot;
            })
            .map(plotRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Plot> findAll(Pageable pageable) {
        log.debug("Request to get all Plots");
        return plotRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Plot> findOne(Long id) {
        log.debug("Request to get Plot : {}", id);
        return plotRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Plot : {}", id);
        plotRepository.deleteById(id);
    }
}
