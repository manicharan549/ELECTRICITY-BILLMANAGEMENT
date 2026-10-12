package com.electricity.billmanagement.model;

import java.math.BigDecimal;

public class TariffSlab {

    private double fromUnit;
    private double toUnit; // Double.MAX_VALUE or 0 for unlimited / above
    private BigDecimal ratePerUnit;

    public TariffSlab() {}

    public TariffSlab(double fromUnit, double toUnit, BigDecimal ratePerUnit) {
        this.fromUnit = fromUnit;
        this.toUnit = toUnit;
        this.ratePerUnit = ratePerUnit;
    }

    public double getFromUnit() { return fromUnit; }
    public void setFromUnit(double fromUnit) { this.fromUnit = fromUnit; }

    public double getToUnit() { return toUnit; }
    public void setToUnit(double toUnit) { this.toUnit = toUnit; }

    public BigDecimal getRatePerUnit() { return ratePerUnit; }
    public void setRatePerUnit(BigDecimal ratePerUnit) { this.ratePerUnit = ratePerUnit; }
}
