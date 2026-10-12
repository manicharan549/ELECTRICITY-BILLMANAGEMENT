package com.electricity.billmanagement.controller;

import com.electricity.billmanagement.dto.AdminDashboardStats;
import com.electricity.billmanagement.dto.ApiResponse;
import com.electricity.billmanagement.dto.GenerateBillRequest;
import com.electricity.billmanagement.dto.TariffRequest;
import com.electricity.billmanagement.model.*;
import com.electricity.billmanagement.service.BillService;
import com.electricity.billmanagement.service.DashboardService;
import com.electricity.billmanagement.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final DashboardService dashboardService;
    private final BillService billService;
    private final PaymentService paymentService;

    public AdminController(DashboardService dashboardService,
                           BillService billService,
                           PaymentService paymentService) {
        this.dashboardService = dashboardService;
        this.billService = billService;
        this.paymentService = paymentService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getDashboard() {
        AdminDashboardStats stats = dashboardService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<User>>> getCustomers() {
        List<User> customers = dashboardService.getAllCustomers();
        // Hide password hashes
        customers.forEach(u -> u.setPasswordHash(null));
        return ResponseEntity.ok(ApiResponse.ok(customers));
    }

    @PatchMapping("/customers/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateCustomerStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> body) {
        boolean active = body.getOrDefault("active", true);
        User updated = dashboardService.updateCustomerStatus(id, active);
        updated.setPasswordHash(null);
        return ResponseEntity.ok(ApiResponse.ok("Customer status updated", updated));
    }

    @GetMapping("/meters")
    public ResponseEntity<ApiResponse<List<Meter>>> getMeters() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getAllMeters()));
    }

    @PostMapping("/meters/assign")
    public ResponseEntity<ApiResponse<Meter>> assignMeter(@RequestBody Map<String, String> body) {
        String customerId = body.get("customerId");
        String meterType = body.getOrDefault("meterType", "DOMESTIC");
        Meter meter = dashboardService.assignMeter(customerId, meterType);
        return ResponseEntity.ok(ApiResponse.ok("Meter assigned successfully", meter));
    }

    @PostMapping("/bills/generate")
    public ResponseEntity<ApiResponse<Bill>> generateBill(@Valid @RequestBody GenerateBillRequest request) {
        Bill bill = billService.generateBill(request);
        return ResponseEntity.ok(ApiResponse.ok("Electricity bill generated successfully", bill));
    }

    @GetMapping("/bills")
    public ResponseEntity<ApiResponse<List<Bill>>> getAllBills() {
        return ResponseEntity.ok(ApiResponse.ok(billService.getAllBills()));
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments() {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.getAllPayments()));
    }

    @GetMapping("/tariffs")
    public ResponseEntity<ApiResponse<List<Tariff>>> getAllTariffs() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getAllTariffs()));
    }

    @PostMapping("/tariffs")
    public ResponseEntity<ApiResponse<Tariff>> createTariff(@Valid @RequestBody TariffRequest request) {
        Tariff tariff = dashboardService.createTariff(request);
        return ResponseEntity.ok(ApiResponse.ok("Tariff configured successfully", tariff));
    }
}
