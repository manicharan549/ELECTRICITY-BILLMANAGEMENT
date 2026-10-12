package com.electricity.billmanagement.service;

import com.electricity.billmanagement.dto.AdminDashboardStats;
import com.electricity.billmanagement.dto.CustomerDashboardStats;
import com.electricity.billmanagement.dto.TariffRequest;
import com.electricity.billmanagement.model.*;
import com.electricity.billmanagement.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final MeterRepository meterRepository;
    private final BillRepository billRepository;
    private final PaymentRepository paymentRepository;
    private final TariffRepository tariffRepository;
    private final BillService billService;

    public DashboardService(UserRepository userRepository,
                            MeterRepository meterRepository,
                            BillRepository billRepository,
                            PaymentRepository paymentRepository,
                            TariffRepository tariffRepository,
                            BillService billService) {
        this.userRepository = userRepository;
        this.meterRepository = meterRepository;
        this.billRepository = billRepository;
        this.paymentRepository = paymentRepository;
        this.tariffRepository = tariffRepository;
        this.billService = billService;
    }

    public AdminDashboardStats getAdminStats() {
        billService.updateOverdueStatus();

        AdminDashboardStats stats = new AdminDashboardStats();
        stats.setTotalCustomers(userRepository.countByRole(Role.ROLE_CUSTOMER));
        stats.setActiveCustomers(userRepository.countByRoleAndActive(Role.ROLE_CUSTOMER, true));

        stats.setTotalBills(billRepository.count());
        stats.setPaidBills(billRepository.countByStatus(BillStatus.PAID));
        stats.setUnpaidBills(billRepository.countByStatus(BillStatus.UNPAID));
        stats.setOverdueBills(billRepository.countByStatus(BillStatus.OVERDUE));

        List<Payment> allPayments = paymentRepository.findAll();
        stats.setTotalRecordedPayments(allPayments.size());

        BigDecimal totalRevenue = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .map(Payment::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalRevenueCollected(totalRevenue);

        // Aggregate monthly revenue and consumption from stored data
        List<Bill> allBills = billRepository.findAll(Sort.by(Sort.Direction.ASC, "issueDate"));
        Map<String, BigDecimal> revenueByMonth = new TreeMap<>();
        Map<String, Double> consumptionByMonth = new TreeMap<>();

        for (Bill b : allBills) {
            String month = b.getBillingMonth() != null ? b.getBillingMonth() : "Unknown";
            if (b.getStatus() == BillStatus.PAID) {
                revenueByMonth.put(month, revenueByMonth.getOrDefault(month, BigDecimal.ZERO).add(b.getTotalAmount()));
            }
            consumptionByMonth.put(month, consumptionByMonth.getOrDefault(month, 0.0) + b.getUnitsConsumed());
        }

        List<Map<String, Object>> revenueList = revenueByMonth.entrySet().stream().map(entry -> {
            Map<String, Object> map = new HashMap<>();
            map.put("month", entry.getKey());
            map.put("revenue", entry.getValue());
            return map;
        }).collect(Collectors.toList());

        List<Map<String, Object>> consumptionList = consumptionByMonth.entrySet().stream().map(entry -> {
            Map<String, Object> map = new HashMap<>();
            map.put("month", entry.getKey());
            map.put("units", entry.getValue());
            return map;
        }).collect(Collectors.toList());

        stats.setMonthlyRevenue(revenueList);
        stats.setMonthlyConsumption(consumptionList);

        return stats;
    }

    public CustomerDashboardStats getCustomerStats(String customerId) {
        billService.updateOverdueStatus();

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + customerId));

        Meter meter = meterRepository.findFirstByCustomerIdAndActive(customerId, true)
                .orElse(null);

        CustomerDashboardStats stats = new CustomerDashboardStats();
        stats.setCustomerId(customer.getId());
        stats.setCustomerName(customer.getName());

        if (meter != null) {
            stats.setMeterNumber(meter.getMeterNumber());
            stats.setMeterType(meter.getMeterType());
        } else {
            stats.setMeterNumber("UNASSIGNED");
            stats.setMeterType("DOMESTIC");
        }

        List<Bill> bills = billRepository.findByCustomerId(customerId, Sort.by(Sort.Direction.DESC, "issueDate"));
        stats.setRecentBills(bills.stream().limit(5).collect(Collectors.toList()));

        BigDecimal outstanding = BigDecimal.ZERO;
        for (Bill b : bills) {
            if (b.getStatus() == BillStatus.UNPAID || b.getStatus() == BillStatus.OVERDUE) {
                outstanding = outstanding.add(b.getTotalAmount());
            }
        }
        stats.setTotalOutstandingAmount(outstanding);

        if (!bills.isEmpty()) {
            Bill latest = bills.get(0);
            stats.setCurrentMonthConsumption(latest.getUnitsConsumed());
            stats.setLatestBillAmount(latest.getTotalAmount());
            stats.setNextBillDueDate(latest.getDueDate());
            stats.setLatestBillStatus(latest.getStatus().name());
            stats.setLatestBillId(latest.getId());
        } else {
            stats.setCurrentMonthConsumption(0.0);
            stats.setLatestBillAmount(BigDecimal.ZERO);
            stats.setNextBillDueDate(LocalDate.now().plusDays(15));
            stats.setLatestBillStatus("NO_BILLS");
            stats.setLatestBillId(null);
        }

        // Monthly consumption history for this customer
        List<Map<String, Object>> consumptionHistory = bills.stream()
                .sorted(Comparator.comparing(Bill::getIssueDate))
                .map(b -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("month", b.getBillingMonth());
                    m.put("units", b.getUnitsConsumed());
                    m.put("amount", b.getTotalAmount());
                    return m;
                })
                .collect(Collectors.toList());

        stats.setMonthlyConsumption(consumptionHistory);

        return stats;
    }

    public List<User> getAllCustomers() {
        return userRepository.findByRole(Role.ROLE_CUSTOMER);
    }

    public User updateCustomerStatus(String customerId, boolean active) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + customerId));
        user.setActive(active);
        return userRepository.save(user);
    }

    public List<Meter> getAllMeters() {
        return meterRepository.findAll();
    }

    public Meter assignMeter(String customerId, String meterType) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + customerId));

        Random random = new Random();
        String meterNumber;
        do {
            meterNumber = "MTR-" + (100000 + random.nextInt(900000));
        } while (meterRepository.existsByMeterNumber(meterNumber));

        Meter meter = new Meter(
                meterNumber,
                user.getId(),
                meterType != null ? meterType : "DOMESTIC",
                LocalDate.now(),
                true,
                0.0
        );
        return meterRepository.save(meter);
    }

    public Tariff createTariff(TariffRequest request) {
        if (request.isActive()) {
            // Deactivate previous active tariffs
            List<Tariff> activeTariffs = tariffRepository.findByActive(true);
            for (Tariff t : activeTariffs) {
                t.setActive(false);
                t.setEffectiveTo(LocalDate.now());
                tariffRepository.save(t);
            }
        }

        Tariff tariff = new Tariff(
                request.getName(),
                request.getSlabs(),
                request.getFixedCharge(),
                request.getEffectiveFrom() != null ? request.getEffectiveFrom() : LocalDate.now(),
                request.isActive()
        );
        return tariffRepository.save(tariff);
    }

    public List<Tariff> getAllTariffs() {
        return tariffRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
