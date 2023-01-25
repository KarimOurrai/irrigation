package com.karim.irrigation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Crop.
 */
@Entity
@Table(name = "crop")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Crop implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "water_amount")
    private Double waterAmount;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "area")
    private Double area;

    @OneToMany(mappedBy = "crop")
    @JsonIgnoreProperties(value = { "timeSlots", "crop", "sensor", "timeSlots" }, allowSetters = true)
    private Set<Plot> plots = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Crop id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return this.type;
    }

    public Crop type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getWaterAmount() {
        return this.waterAmount;
    }

    public Crop waterAmount(Double waterAmount) {
        this.setWaterAmount(waterAmount);
        return this;
    }

    public void setWaterAmount(Double waterAmount) {
        this.waterAmount = waterAmount;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public Crop duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Double getArea() {
        return this.area;
    }

    public Crop area(Double area) {
        this.setArea(area);
        return this;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public Set<Plot> getPlots() {
        return this.plots;
    }

    public void setPlots(Set<Plot> plots) {
        if (this.plots != null) {
            this.plots.forEach(i -> i.setCrop(null));
        }
        if (plots != null) {
            plots.forEach(i -> i.setCrop(this));
        }
        this.plots = plots;
    }

    public Crop plots(Set<Plot> plots) {
        this.setPlots(plots);
        return this;
    }

    public Crop addPlot(Plot plot) {
        this.plots.add(plot);
        plot.setCrop(this);
        return this;
    }

    public Crop removePlot(Plot plot) {
        this.plots.remove(plot);
        plot.setCrop(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Crop)) {
            return false;
        }
        return id != null && id.equals(((Crop) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Crop{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", waterAmount=" + getWaterAmount() +
            ", duration=" + getDuration() +
            ", area=" + getArea() +
            "}";
    }
}
