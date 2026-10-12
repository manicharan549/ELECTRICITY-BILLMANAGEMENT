package com.electricity.billmanagement.service;

import com.electricity.billmanagement.model.Tariff;
import com.electricity.billmanagement.model.TariffSlab;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class BillCalculationServiceTest {

    private BillCalculationService calculationService;
    private Tariff testTariff;

    @BeforeEach
    public void setup() {
        calculationService = new BillCalculationService();

        List<TariffSlab> slabs = new ArrayList<>();
        slabs.add(new TariffSlab(0, 100, BigDecimal.valueOf(2.00)));
        slabs.add(new TariffSlab(100, 200, BigDecimal.valueOf(3.00)));
        slabs.add(new TariffSlab(200, Double.MAX_VALUE, BigDecimal.valueOf(5.00)));

        testTariff = new Tariff("Test Tariff", slabs, BigDecimal.valueOf(50.00), null, true);
    }

    @Test
    public void testSpecificationExample() {
        // Example from prompt:
        // Previous reading = 1250 kWh, Current reading = 1430 kWh
        // Units consumed = 180 kWh
        // First 100 units = ₹200
        // Next 80 units = ₹240
        // Energy charge = ₹440 + fixed charge (50) = 490
        BillCalculationService.CalculationResult res = calculationService.calculateBill(1250.0, 1430.0, testTariff);

        assertEquals(180.0, res.getUnits(), 0.001);
        assertEquals(new BigDecimal("440.00"), res.getEnergyCharges());
        assertEquals(new BigDecimal("490.00"), res.getTotalAmount());
        assertEquals(2, res.getBreakdown().size());
        assertEquals(new BigDecimal("200.00"), res.getBreakdown().get(0).getSlabTotal());
        assertEquals(new BigDecimal("240.00"), res.getBreakdown().get(1).getSlabTotal());
    }

    @Test
    public void testReadingLessThanPreviousThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            calculationService.calculateBill(1500.0, 1400.0, testTariff);
        });
    }

    @Test
    public void testHighConsumptionTier() {
        // 250 units: 100 @ 2 (200) + 100 @ 3 (300) + 50 @ 5 (250) = 750 energy charges
        BillCalculationService.CalculationResult res = calculationService.calculateBill(1000.0, 1250.0, testTariff);
        assertEquals(250.0, res.getUnits(), 0.001);
        assertEquals(new BigDecimal("750.00"), res.getEnergyCharges());
        assertEquals(new BigDecimal("800.00"), res.getTotalAmount());
    }
}
