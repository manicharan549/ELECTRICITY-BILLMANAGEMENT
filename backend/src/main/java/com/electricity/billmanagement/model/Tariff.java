package com.electricity.billmanagement.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tariffs")
public class Tariff {

    @Id
    private String id;

    private String name;

    private List<TariffSlab> slabs = new ArrayList<>();

    private BigDecimal fixedCharge = BigDecimal.ZERO;

    private LocalDate effectiveFrom = LocalDate.now();

    private LocalDate effectiveTo;

    private boolean active = true;

    @CreatedDate
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    public Tariff() {}

    public Tariff(String name, List<TariffSlab> slabs, BigDecimal fixedCharge, LocalDate effectiveFrom, boolean active) {
        this.name = name;
        this.slabs = slabs;
        this.fixedCharge = fixedCharge != null ? fixedCharge : BigDecimal.ZERO;
        this.effectiveFrom = effectiveFrom != null ? effectiveFrom : LocalDate.now();
        this.active = active;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<TariffSlab> getSlabs() { return slabs; }
    public void setSlabs(List<TariffSlab> slabs) { this.slabs = slabs; }

    public BigDecimal getFixedCharge() { return fixedCharge; }
    public void setFixedCharge(BigDecimal fixedCharge) { this.fixedCharge = fixedCharge; }

    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public LocalDate getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
