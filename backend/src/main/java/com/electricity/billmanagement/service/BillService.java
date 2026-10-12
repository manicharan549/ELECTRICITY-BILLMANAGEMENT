package com.electricity.billmanagement.service;

import com.electricity.billmanagement.dto.GenerateBillRequest;
import com.electricity.billmanagement.model.*;
import com.electricity.billmanagement.repository.BillRepository;
import com.electricity.billmanagement.repository.MeterRepository;
import com.electricity.billmanagement.repository.TariffRepository;
import com.electricity.billmanagement.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final MeterRepository meterRepository;
    private final UserRepository userRepository;
    private final TariffRepository tariffRepository;
    private final BillCalculationService billCalculationService;

    public BillService(BillRepository billRepository,
                       MeterRepository meterRepository,
                       UserRepository userRepository,
                       TariffRepository tariffRepository,
                       BillCalculationService billCalculationService) {
        this.billRepository = billRepository;
        this.meterRepository = meterRepository;
        this.userRepository = userRepository;
        this.tariffRepository = tariffRepository;
        this.billCalculationService = billCalculationService;
    }

    public Bill generateBill(GenerateBillRequest request) {
        Meter meter = meterRepository.findById(request.getMeterId())
                .orElseThrow(() -> new IllegalArgumentException("Meter not found with ID: " + request.getMeterId()));

        User customer = userRepository.findById(meter.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found for meter: " + meter.getMeterNumber()));

        String billingMonth = request.getBillingMonth().trim();
        if (billRepository.existsByMeterIdAndBillingMonth(meter.getId(), billingMonth)) {
            throw new IllegalArgumentException("A bill has already been generated for meter " + meter.getMeterNumber() + " for billing month " + billingMonth);
        }

        // Determine previous reading: if not provided, take from meter's last recorded reading
        double prevReading = (request.getPreviousReading() != null)
                ? request.getPreviousReading()
                : meter.getLastRecordedReading();

        double currReading = request.getCurrentReading();

        if (currReading < prevReading) {
            throw new IllegalArgumentException("Current reading (" + currReading + ") cannot be less than previous reading (" + prevReading + ")");
        }

        // Get active tariff
        Tariff activeTariff = tariffRepository.findFirstByActiveTrueOrderByEffectiveFromDesc()
                .orElse(null);

        BillCalculationService.CalculationResult calc = billCalculationService.calculateBill(prevReading, currReading, activeTariff);

        Bill bill = new Bill();
        bill.setBillNumber(generateUniqueBillNumber());
        bill.setCustomerId(customer.getId());
        bill.setCustomerName(customer.getName());
        bill.setMeterId(meter.getId());
        bill.setMeterNumber(meter.getMeterNumber());
        bill.setBillingMonth(billingMonth);
        bill.setPreviousReading(prevReading);
        bill.setCurrentReading(currReading);
        bill.setUnitsConsumed(calc.getUnits());
        bill.setTariffBreakdown(calc.getBreakdown());
        bill.setEnergyCharges(calc.getEnergyCharges());
        bill.setFixedCharges(calc.getFixedCharges());
        bill.setTotalAmount(calc.getTotalAmount());
        bill.setIssueDate(LocalDate.now());

        LocalDate dueDate = (request.getDueDate() != null) ? request.getDueDate() : LocalDate.now().plusDays(15);
        bill.setDueDate(dueDate);
        bill.setStatus(BillStatus.UNPAID);

        if (activeTariff != null) {
            bill.setTariffId(activeTariff.getId());
            bill.setTariffName(activeTariff.getName());
        }

        Bill saved = billRepository.save(bill);

        // Update meter's last recorded reading
        meter.setLastRecordedReading(currReading);
        meterRepository.save(meter);

        return saved;
    }

    public List<Bill> getBillsForCustomer(String customerId, BillStatus status) {
        updateOverdueStatus();
        Sort sort = Sort.by(Sort.Direction.DESC, "issueDate");
        if (status != null) {
            return billRepository.findByCustomerIdAndStatus(customerId, status, sort);
        }
        return billRepository.findByCustomerId(customerId, sort);
    }

    public List<Bill> getAllBills() {
        updateOverdueStatus();
        return billRepository.findAll(Sort.by(Sort.Direction.DESC, "issueDate"));
    }

    public Bill getBillById(String id) {
        updateOverdueStatus();
        return billRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + id));
    }

    public void updateOverdueStatus() {
        LocalDate today = LocalDate.now();
        List<Bill> unpaidBills = billRepository.findAll();
        for (Bill bill : unpaidBills) {
            if (bill.getStatus() == BillStatus.UNPAID && bill.getDueDate() != null && bill.getDueDate().isBefore(today)) {
                bill.setStatus(BillStatus.OVERDUE);
                billRepository.save(bill);
            }
        }
    }

    private String generateUniqueBillNumber() {
        Random random = new Random();
        String billNumber;
        do {
            billNumber = "BILL-" + LocalDate.now().getYear() + "-" + (100000 + random.nextInt(900000));
        } while (billRepository.findByBillNumber(billNumber).isPresent());
        return billNumber;
    }
}
