package com.electricity.billmanagement.dto;

import com.electricity.billmanagement.model.TariffSlab;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TariffRequest {

    @NotBlank(message = "Tariff name is required")
    private String name;

    @NotNull(message = "Slabs cannot be empty")
    private List<TariffSlab> slabs;

    private BigDecimal fixedCharge = BigDecimal.ZERO;

    private LocalDate effectiveFrom;

    private boolean active = true;

    public TariffRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<TariffSlab> getSlabs() { return slabs; }
    public void setSlabs(List<TariffSlab> slabs) { this.slabs = slabs; }

    public BigDecimal getFixedCharge() { return fixedCharge; }
    public void setFixedCharge(BigDecimal fixedCharge) { this.fixedCharge = fixedCharge; }

    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
