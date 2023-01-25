package com.karim.irrigation.web.rest;

import com.karim.irrigation.domain.TimeSlot;
import com.karim.irrigation.repository.TimeSlotRepository;
import com.karim.irrigation.service.TimeSlotService;
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
 * REST controller for managing {@link com.karim.irrigation.domain.TimeSlot}.
 */
@RestController
@RequestMapping("/api")
public class TimeSlotResource {

    private final Logger log = LoggerFactory.getLogger(TimeSlotResource.class);

    private static final String ENTITY_NAME = "timeSlot";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TimeSlotService timeSlotService;

    private final TimeSlotRepository timeSlotRepository;

    public TimeSlotResource(TimeSlotService timeSlotService, TimeSlotRepository timeSlotRepository) {
        this.timeSlotService = timeSlotService;
        this.timeSlotRepository = timeSlotRepository;
    }

    /**
     * {@code POST  /time-slots} : Create a new timeSlot.
     *
     * @param timeSlot the timeSlot to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new timeSlot, or with status {@code 400 (Bad Request)} if the timeSlot has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/time-slots")
    public ResponseEntity<TimeSlot> createTimeSlot(@RequestBody TimeSlot timeSlot) throws URISyntaxException {
        log.debug("REST request to save TimeSlot : {}", timeSlot);
        if (timeSlot.getId() != null) {
            throw new BadRequestAlertException("A new timeSlot cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TimeSlot result = timeSlotService.save(timeSlot);
        return ResponseEntity
            .created(new URI("/api/time-slots/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /time-slots/:id} : Updates an existing timeSlot.
     *
     * @param id the id of the timeSlot to save.
     * @param timeSlot the timeSlot to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timeSlot,
     * or with status {@code 400 (Bad Request)} if the timeSlot is not valid,
     * or with status {@code 500 (Internal Server Error)} if the timeSlot couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/time-slots/{id}")
    public ResponseEntity<TimeSlot> updateTimeSlot(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TimeSlot timeSlot
    ) throws URISyntaxException {
        log.debug("REST request to update TimeSlot : {}, {}", id, timeSlot);
        if (timeSlot.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, timeSlot.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timeSlotRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TimeSlot result = timeSlotService.update(timeSlot);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, timeSlot.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /time-slots/:id} : Partial updates given fields of an existing timeSlot, field will ignore if it is null
     *
     * @param id the id of the timeSlot to save.
     * @param timeSlot the timeSlot to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timeSlot,
     * or with status {@code 400 (Bad Request)} if the timeSlot is not valid,
     * or with status {@code 404 (Not Found)} if the timeSlot is not found,
     * or with status {@code 500 (Internal Server Error)} if the timeSlot couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/time-slots/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TimeSlot> partialUpdateTimeSlot(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TimeSlot timeSlot
    ) throws URISyntaxException {
        log.debug("REST request to partial update TimeSlot partially : {}, {}", id, timeSlot);
        if (timeSlot.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, timeSlot.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timeSlotRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TimeSlot> result = timeSlotService.partialUpdate(timeSlot);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, timeSlot.getId().toString())
        );
    }

    /**
     * {@code GET  /time-slots} : get all the timeSlots.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of timeSlots in body.
     */
    @GetMapping("/time-slots")
    public ResponseEntity<List<TimeSlot>> getAllTimeSlots(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of TimeSlots");
        Page<TimeSlot> page = timeSlotService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /time-slots/:id} : get the "id" timeSlot.
     *
     * @param id the id of the timeSlot to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the timeSlot, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/time-slots/{id}")
    public ResponseEntity<TimeSlot> getTimeSlot(@PathVariable Long id) {
        log.debug("REST request to get TimeSlot : {}", id);
        Optional<TimeSlot> timeSlot = timeSlotService.findOne(id);
        return ResponseUtil.wrapOrNotFound(timeSlot);
    }

    /**
     * {@code DELETE  /time-slots/:id} : delete the "id" timeSlot.
     *
     * @param id the id of the timeSlot to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/time-slots/{id}")
    public ResponseEntity<Void> deleteTimeSlot(@PathVariable Long id) {
        log.debug("REST request to delete TimeSlot : {}", id);
        timeSlotService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
