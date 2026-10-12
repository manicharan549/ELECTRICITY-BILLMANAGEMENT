package com.electricity.billmanagement.model;

import java.math.BigDecimal;

public class TariffBreakdownItem {

    private String slabDescription;
    private double unitsCharged;
    private BigDecimal ratePerUnit;
    private BigDecimal slabTotal;

    public TariffBreakdownItem() {}

    public TariffBreakdownItem(String slabDescription, double unitsCharged, BigDecimal ratePerUnit, BigDecimal slabTotal) {
        this.slabDescription = slabDescription;
        this.unitsCharged = unitsCharged;
        this.ratePerUnit = ratePerUnit;
        this.slabTotal = slabTotal;
    }

    public String getSlabDescription() { return slabDescription; }
    public void setSlabDescription(String slabDescription) { this.slabDescription = slabDescription; }

    public double getUnitsCharged() { return unitsCharged; }
    public void setUnitsCharged(double unitsCharged) { this.unitsCharged = unitsCharged; }

    public BigDecimal getRatePerUnit() { return ratePerUnit; }
    public void setRatePerUnit(BigDecimal ratePerUnit) { this.ratePerUnit = ratePerUnit; }

    public BigDecimal getSlabTotal() { return slabTotal; }
    public void setSlabTotal(BigDecimal slabTotal) { this.slabTotal = slabTotal; }
}
