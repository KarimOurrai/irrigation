package com.karim.irrigation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.karim.irrigation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CropTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Crop.class);
        Crop crop1 = new Crop();
        crop1.setId(1L);
        Crop crop2 = new Crop();
        crop2.setId(crop1.getId());
        assertThat(crop1).isEqualTo(crop2);
        crop2.setId(2L);
        assertThat(crop1).isNotEqualTo(crop2);
        crop1.setId(null);
        assertThat(crop1).isNotEqualTo(crop2);
    }
}
