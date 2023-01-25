package com.karim.irrigation.service.impl;

import com.karim.irrigation.domain.Sensor;
import com.karim.irrigation.repository.SensorRepository;
import com.karim.irrigation.service.SensorService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Sensor}.
 */
@Service
@Transactional
public class SensorServiceImpl implements SensorService {

    private final Logger log = LoggerFactory.getLogger(SensorServiceImpl.class);

    private final SensorRepository sensorRepository;

    public SensorServiceImpl(SensorRepository sensorRepository) {
        this.sensorRepository = sensorRepository;
    }

    @Override
    public Sensor save(Sensor sensor) {
        log.debug("Request to save Sensor : {}", sensor);
        return sensorRepository.save(sensor);
    }

    @Override
    public Sensor update(Sensor sensor) {
        log.debug("Request to update Sensor : {}", sensor);
        return sensorRepository.save(sensor);
    }

    @Override
    public Optional<Sensor> partialUpdate(Sensor sensor) {
        log.debug("Request to partially update Sensor : {}", sensor);

        return sensorRepository
            .findById(sensor.getId())
            .map(existingSensor -> {
                if (sensor.getName() != null) {
                    existingSensor.setName(sensor.getName());
                }
                if (sensor.getStatus() != null) {
                    existingSensor.setStatus(sensor.getStatus());
                }

                return existingSensor;
            })
            .map(sensorRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Sensor> findAll(Pageable pageable) {
        log.debug("Request to get all Sensors");
        return sensorRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Sensor> findOne(Long id) {
        log.debug("Request to get Sensor : {}", id);
        return sensorRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Sensor : {}", id);
        sensorRepository.deleteById(id);
    }
}
