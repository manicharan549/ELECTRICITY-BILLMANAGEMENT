package com.electricity.billmanagement.service;

import com.electricity.billmanagement.model.Tariff;
import com.electricity.billmanagement.model.TariffBreakdownItem;
import com.electricity.billmanagement.model.TariffSlab;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class BillCalculationService {

    public static class CalculationResult {
        private final double units;
        private final BigDecimal energyCharges;
        private final BigDecimal fixedCharges;
        private final BigDecimal totalAmount;
        private final List<TariffBreakdownItem> breakdown;

        public CalculationResult(double units, BigDecimal energyCharges, BigDecimal fixedCharges, BigDecimal totalAmount, List<TariffBreakdownItem> breakdown) {
            this.units = units;
            this.energyCharges = energyCharges;
            this.fixedCharges = fixedCharges;
            this.totalAmount = totalAmount;
            this.breakdown = breakdown;
        }

        public double getUnits() { return units; }
        public BigDecimal getEnergyCharges() { return energyCharges; }
        public BigDecimal getFixedCharges() { return fixedCharges; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public List<TariffBreakdownItem> getBreakdown() { return breakdown; }
    }

    public CalculationResult calculateBill(double previousReading, double currentReading, Tariff tariff) {
        if (currentReading < previousReading) {
            throw new IllegalArgumentException("Current meter reading (" + currentReading + ") cannot be less than previous meter reading (" + previousReading + ")");
        }

        double unitsConsumed = currentReading - previousReading;
        List<TariffBreakdownItem> breakdown = new ArrayList<>();
        BigDecimal energyCharges = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        if (tariff != null && tariff.getSlabs() != null && !tariff.getSlabs().isEmpty()) {
            double remainingUnits = unitsConsumed;

            for (TariffSlab slab : tariff.getSlabs()) {
                if (remainingUnits <= 0) break;

                double slabSpan = slab.getToUnit() - slab.getFromUnit();
                double unitsInThisSlab;

                if (slab.getToUnit() >= Double.MAX_VALUE || slab.getToUnit() <= 0) {
                    // Unlimited / topmost slab
                    unitsInThisSlab = remainingUnits;
                } else {
                    unitsInThisSlab = Math.min(remainingUnits, slabSpan);
                }

                if (unitsInThisSlab > 0) {
                    BigDecimal slabCost = slab.getRatePerUnit().multiply(BigDecimal.valueOf(unitsInThisSlab)).setScale(2, RoundingMode.HALF_UP);
                    energyCharges = energyCharges.add(slabCost);

                    String desc = slab.getToUnit() >= Double.MAX_VALUE || slab.getToUnit() <= 0
                            ? String.format("Above %.0f units @ ₹%.2f/unit", slab.getFromUnit(), slab.getRatePerUnit())
                            : String.format("%.0f - %.0f units @ ₹%.2f/unit", slab.getFromUnit(), slab.getToUnit(), slab.getRatePerUnit());

                    breakdown.add(new TariffBreakdownItem(desc, unitsInThisSlab, slab.getRatePerUnit(), slabCost));
                    remainingUnits -= unitsInThisSlab;
                }
            }
        } else {
            // Fallback to standard specification:
            // 0-100: ₹2, 101-200: ₹3, Above 200: ₹5
            double u1 = Math.min(unitsConsumed, 100);
            if (u1 > 0) {
                BigDecimal cost1 = BigDecimal.valueOf(2.00).multiply(BigDecimal.valueOf(u1)).setScale(2, RoundingMode.HALF_UP);
                energyCharges = energyCharges.add(cost1);
                breakdown.add(new TariffBreakdownItem("First 100 units @ ₹2.00/unit", u1, BigDecimal.valueOf(2.00), cost1));
            }

            if (unitsConsumed > 100) {
                double u2 = Math.min(unitsConsumed - 100, 100);
                BigDecimal cost2 = BigDecimal.valueOf(3.00).multiply(BigDecimal.valueOf(u2)).setScale(2, RoundingMode.HALF_UP);
                energyCharges = energyCharges.add(cost2);
                breakdown.add(new TariffBreakdownItem("Next 100 units (101-200) @ ₹3.00/unit", u2, BigDecimal.valueOf(3.00), cost2));
            }

            if (unitsConsumed > 200) {
                double u3 = unitsConsumed - 200;
                BigDecimal cost3 = BigDecimal.valueOf(5.00).multiply(BigDecimal.valueOf(u3)).setScale(2, RoundingMode.HALF_UP);
                energyCharges = energyCharges.add(cost3);
                breakdown.add(new TariffBreakdownItem("Above 200 units @ ₹5.00/unit", u3, BigDecimal.valueOf(5.00), cost3));
            }
        }

        BigDecimal fixedCharges = (tariff != null && tariff.getFixedCharge() != null)
                ? tariff.getFixedCharge().setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalAmount = energyCharges.add(fixedCharges).setScale(2, RoundingMode.HALF_UP);

        return new CalculationResult(unitsConsumed, energyCharges, fixedCharges, totalAmount, breakdown);
    }
}
