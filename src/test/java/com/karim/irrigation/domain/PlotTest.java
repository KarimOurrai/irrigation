package com.karim.irrigation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.karim.irrigation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlotTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Plot.class);
        Plot plot1 = new Plot();
        plot1.setId(1L);
        Plot plot2 = new Plot();
        plot2.setId(plot1.getId());
        assertThat(plot1).isEqualTo(plot2);
        plot2.setId(2L);
        assertThat(plot1).isNotEqualTo(plot2);
        plot1.setId(null);
        assertThat(plot1).isNotEqualTo(plot2);
    }
}
