package com.karim.irrigation.web.rest;

import com.karim.irrigation.domain.Plot;
import com.karim.irrigation.repository.PlotRepository;
import com.karim.irrigation.service.PlotService;
import com.karim.irrigation.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.karim.irrigation.domain.Plot}.
 */
@RestController
@RequestMapping("/api")
public class PlotResource {

    private final Logger log = LoggerFactory.getLogger(PlotResource.class);

    private static final String ENTITY_NAME = "plot";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlotService plotService;

    private final PlotRepository plotRepository;

    public PlotResource(PlotService plotService, PlotRepository plotRepository) {
        this.plotService = plotService;
        this.plotRepository = plotRepository;
    }

    /**
     * {@code POST  /plots} : Create a new plot.
     *
     * @param plot the plot to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new plot, or with status {@code 400 (Bad Request)} if the plot has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/plots")
    public ResponseEntity<Plot> createPlot(@RequestBody Plot plot) throws URISyntaxException {
        log.debug("REST request to save Plot : {}", plot);
        if (plot.getId() != null) {
            throw new BadRequestAlertException("A new plot cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Plot result = plotService.save(plot);
        return ResponseEntity
            .created(new URI("/api/plots/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /plots/:id} : Updates an existing plot.
     *
     * @param id the id of the plot to save.
     * @param plot the plot to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plot,
     * or with status {@code 400 (Bad Request)} if the plot is not valid,
     * or with status {@code 500 (Internal Server Error)} if the plot couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/plots/{id}")
    public ResponseEntity<Plot> updatePlot(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plot plot)
        throws URISyntaxException {
        log.debug("REST request to update Plot : {}, {}", id, plot);
        if (plot.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plot.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plotRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Plot result = plotService.update(plot);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plot.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /plots/:id} : Partial updates given fields of an existing plot, field will ignore if it is null
     *
     * @param id the id of the plot to save.
     * @param plot the plot to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plot,
     * or with status {@code 400 (Bad Request)} if the plot is not valid,
     * or with status {@code 404 (Not Found)} if the plot is not found,
     * or with status {@code 500 (Internal Server Error)} if the plot couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/plots/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Plot> partialUpdatePlot(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plot plot)
        throws URISyntaxException {
        log.debug("REST request to partial update Plot partially : {}, {}", id, plot);
        if (plot.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plot.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plotRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Plot> result = plotService.partialUpdate(plot);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plot.getId().toString())
        );
    }

    /**
     * {@code GET  /plots} : get all the plots.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of plots in body.
     */
    @GetMapping("/plots")
    public ResponseEntity<List<Plot>> getAllPlots(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Plots");
        Page<Plot> page = plotService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /plots/:id} : get the "id" plot.
     *
     * @param id the id of the plot to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the plot, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/plots/{id}")
    public ResponseEntity<Plot> getPlot(@PathVariable Long id) {
        log.debug("REST request to get Plot : {}", id);
        Optional<Plot> plot = plotService.findOne(id);
        return ResponseUtil.wrapOrNotFound(plot);
    }

    /**
     * {@code DELETE  /plots/:id} : delete the "id" plot.
     *
     * @param id the id of the plot to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/plots/{id}")
    public ResponseEntity<Void> deletePlot(@PathVariable Long id) {
        log.debug("REST request to delete Plot : {}", id);
        plotService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
