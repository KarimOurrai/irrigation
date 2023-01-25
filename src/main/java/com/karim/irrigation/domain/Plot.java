package com.karim.irrigation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Plot.
 */
@Entity
@Table(name = "plot")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Plot implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "cultivated_area")
    private Long cultivatedArea;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @OneToMany(mappedBy = "plot")
    @JsonIgnoreProperties(value = { "plot", "plot" }, allowSetters = true)
    private Set<TimeSlot> timeSlots = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "plots" }, allowSetters = true)
    private Crop crop;

    @ManyToOne
    @JsonIgnoreProperties(value = { "plots" }, allowSetters = true)
    private Sensor sensor;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Plot id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCultivatedArea() {
        return this.cultivatedArea;
    }

    public Plot cultivatedArea(Long cultivatedArea) {
        this.setCultivatedArea(cultivatedArea);
        return this;
    }

    public void setCultivatedArea(Long cultivatedArea) {
        this.cultivatedArea = cultivatedArea;
    }

    public String getName() {
        return this.name;
    }

    public Plot name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return this.location;
    }

    public Plot location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Crop getCrop() {
        return this.crop;
    }

    public void setCrop(Crop crop) {
        this.crop = crop;
    }

    public Plot crop(Crop crop) {
        this.setCrop(crop);
        return this;
    }

    public Sensor getSensor() {
        return this.sensor;
    }

    public void setSensor(Sensor sensor) {
        this.sensor = sensor;
    }

    public Plot sensor(Sensor sensor) {
        this.setSensor(sensor);
        return this;
    }

    public Set<TimeSlot> getTimeSlots() {
        return this.timeSlots;
    }

    public void setTimeSlots(Set<TimeSlot> timeSlots) {
        if (this.timeSlots != null) {
            this.timeSlots.forEach(i -> i.setPlot(null));
        }
        if (timeSlots != null) {
            timeSlots.forEach(i -> i.setPlot(this));
        }
        this.timeSlots = timeSlots;
    }

    public Plot timeSlots(Set<TimeSlot> timeSlots) {
        this.setTimeSlots(timeSlots);
        return this;
    }

    public Plot addTimeSlot(TimeSlot timeSlot) {
        this.timeSlots.add(timeSlot);
        timeSlot.setPlot(this);
        return this;
    }

    public Plot removeTimeSlot(TimeSlot timeSlot) {
        this.timeSlots.remove(timeSlot);
        timeSlot.setPlot(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Plot)) {
            return false;
        }
        return id != null && id.equals(((Plot) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Plot{" +
            "id=" + getId() +
            ", cultivatedArea=" + getCultivatedArea() +
            ", name='" + getName() + "'" +
            ", location='" + getLocation() + "'" +
            "}";
    }
}
