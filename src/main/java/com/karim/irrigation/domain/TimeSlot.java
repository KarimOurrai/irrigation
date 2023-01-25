package com.karim.irrigation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A TimeSlot.
 */
@Entity
@Table(name = "time_slot")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TimeSlot implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "status")
    private Instant status;

    @Column(name = "water_amount")
    private Double waterAmount;

    @ManyToOne
    @JsonIgnoreProperties(value = { "timeSlots", "crop", "sensor", "timeSlots" }, allowSetters = true)
    private Plot plot;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TimeSlot id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public TimeSlot startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public TimeSlot endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Instant getStatus() {
        return this.status;
    }

    public TimeSlot status(Instant status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Instant status) {
        this.status = status;
    }

    public Double getWaterAmount() {
        return this.waterAmount;
    }

    public TimeSlot waterAmount(Double waterAmount) {
        this.setWaterAmount(waterAmount);
        return this;
    }

    public void setWaterAmount(Double waterAmount) {
        this.waterAmount = waterAmount;
    }

    public Plot getPlot() {
        return this.plot;
    }

    public void setPlot(Plot plot) {
        this.plot = plot;
    }

    public TimeSlot plot(Plot plot) {
        this.setPlot(plot);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TimeSlot)) {
            return false;
        }
        return id != null && id.equals(((TimeSlot) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TimeSlot{" +
            "id=" + getId() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", status='" + getStatus() + "'" +
            ", waterAmount=" + getWaterAmount() +
            "}";
    }
}
