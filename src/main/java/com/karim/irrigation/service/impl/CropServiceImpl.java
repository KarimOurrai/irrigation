package com.karim.irrigation.service.impl;

import com.karim.irrigation.domain.Crop;
import com.karim.irrigation.repository.CropRepository;
import com.karim.irrigation.service.CropService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Crop}.
 */
@Service
@Transactional
public class CropServiceImpl implements CropService {

    private final Logger log = LoggerFactory.getLogger(CropServiceImpl.class);

    private final CropRepository cropRepository;

    public CropServiceImpl(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    @Override
    public Crop save(Crop crop) {
        log.debug("Request to save Crop : {}", crop);
        return cropRepository.save(crop);
    }

    @Override
    public Crop update(Crop crop) {
        log.debug("Request to update Crop : {}", crop);
        return cropRepository.save(crop);
    }

    @Override
    public Optional<Crop> partialUpdate(Crop crop) {
        log.debug("Request to partially update Crop : {}", crop);

        return cropRepository
            .findById(crop.getId())
            .map(existingCrop -> {
                if (crop.getType() != null) {
                    existingCrop.setType(crop.getType());
                }
                if (crop.getWaterAmount() != null) {
                    existingCrop.setWaterAmount(crop.getWaterAmount());
                }
                if (crop.getDuration() != null) {
                    existingCrop.setDuration(crop.getDuration());
                }
                if (crop.getArea() != null) {
                    existingCrop.setArea(crop.getArea());
                }

                return existingCrop;
            })
            .map(cropRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Crop> findAll(Pageable pageable) {
        log.debug("Request to get all Crops");
        return cropRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Crop> findOne(Long id) {
        log.debug("Request to get Crop : {}", id);
        return cropRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Crop : {}", id);
        cropRepository.deleteById(id);
    }
}
