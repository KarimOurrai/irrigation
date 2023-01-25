package com.karim.irrigation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.karim.irrigation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TimeSlotTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TimeSlot.class);
        TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(1L);
        TimeSlot timeSlot2 = new TimeSlot();
        timeSlot2.setId(timeSlot1.getId());
        assertThat(timeSlot1).isEqualTo(timeSlot2);
        timeSlot2.setId(2L);
        assertThat(timeSlot1).isNotEqualTo(timeSlot2);
        timeSlot1.setId(null);
        assertThat(timeSlot1).isNotEqualTo(timeSlot2);
    }
}
