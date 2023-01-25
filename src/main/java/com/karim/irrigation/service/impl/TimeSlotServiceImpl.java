package com.karim.irrigation.service.impl;

import com.karim.irrigation.domain.TimeSlot;
import com.karim.irrigation.repository.TimeSlotRepository;
import com.karim.irrigation.service.TimeSlotService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link TimeSlot}.
 */
@Service
@Transactional
public class TimeSlotServiceImpl implements TimeSlotService {

    private final Logger log = LoggerFactory.getLogger(TimeSlotServiceImpl.class);

    private final TimeSlotRepository timeSlotRepository;

    public TimeSlotServiceImpl(TimeSlotRepository timeSlotRepository) {
        this.timeSlotRepository = timeSlotRepository;
    }

    @Override
    public TimeSlot save(TimeSlot timeSlot) {
        log.debug("Request to save TimeSlot : {}", timeSlot);
        return timeSlotRepository.save(timeSlot);
    }

    @Override
    public TimeSlot update(TimeSlot timeSlot) {
        log.debug("Request to update TimeSlot : {}", timeSlot);
        return timeSlotRepository.save(timeSlot);
    }

    @Override
    public Optional<TimeSlot> partialUpdate(TimeSlot timeSlot) {
        log.debug("Request to partially update TimeSlot : {}", timeSlot);

        return timeSlotRepository
            .findById(timeSlot.getId())
            .map(existingTimeSlot -> {
                if (timeSlot.getStartTime() != null) {
                    existingTimeSlot.setStartTime(timeSlot.getStartTime());
                }
                if (timeSlot.getEndTime() != null) {
                    existingTimeSlot.setEndTime(timeSlot.getEndTime());
                }
                if (timeSlot.getStatus() != null) {
                    existingTimeSlot.setStatus(timeSlot.getStatus());
                }
                if (timeSlot.getWaterAmount() != null) {
                    existingTimeSlot.setWaterAmount(timeSlot.getWaterAmount());
                }

                return existingTimeSlot;
            })
            .map(timeSlotRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TimeSlot> findAll(Pageable pageable) {
        log.debug("Request to get all TimeSlots");
        return timeSlotRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TimeSlot> findOne(Long id) {
        log.debug("Request to get TimeSlot : {}", id);
        return timeSlotRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete TimeSlot : {}", id);
        timeSlotRepository.deleteById(id);
    }
}
