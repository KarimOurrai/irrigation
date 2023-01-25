package com.karim.irrigation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Sensor.
 */
@Entity
@Table(name = "sensor")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Sensor implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "sensor")
    @JsonIgnoreProperties(value = { "timeSlots", "crop", "sensor", "timeSlots" }, allowSetters = true)
    private Set<Plot> plots = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sensor id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Sensor name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return this.status;
    }

    public Sensor status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<Plot> getPlots() {
        return this.plots;
    }

    public void setPlots(Set<Plot> plots) {
        if (this.plots != null) {
            this.plots.forEach(i -> i.setSensor(null));
        }
        if (plots != null) {
            plots.forEach(i -> i.setSensor(this));
        }
        this.plots = plots;
    }

    public Sensor plots(Set<Plot> plots) {
        this.setPlots(plots);
        return this;
    }

    public Sensor addPlot(Plot plot) {
        this.plots.add(plot);
        plot.setSensor(this);
        return this;
    }

    public Sensor removePlot(Plot plot) {
        this.plots.remove(plot);
        plot.setSensor(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sensor)) {
            return false;
        }
        return id != null && id.equals(((Sensor) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sensor{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
