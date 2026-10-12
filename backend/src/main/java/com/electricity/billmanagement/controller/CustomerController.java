package com.electricity.billmanagement.controller;

import com.electricity.billmanagement.dto.ApiResponse;
import com.electricity.billmanagement.dto.CustomerDashboardStats;
import com.electricity.billmanagement.dto.PaymentRequest;
import com.electricity.billmanagement.model.Bill;
import com.electricity.billmanagement.model.BillStatus;
import com.electricity.billmanagement.model.Payment;
import com.electricity.billmanagement.model.User;
import com.electricity.billmanagement.repository.UserRepository;
import com.electricity.billmanagement.security.CustomUserDetails;
import com.electricity.billmanagement.service.BillService;
import com.electricity.billmanagement.service.DashboardService;
import com.electricity.billmanagement.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/customers/me")
public class CustomerController {

    private final DashboardService dashboardService;
    private final BillService billService;
    private final PaymentService paymentService;
    private final UserRepository userRepository;

    public CustomerController(DashboardService dashboardService,
                              BillService billService,
                              PaymentService paymentService,
                              UserRepository userRepository) {
        this.dashboardService = dashboardService;
        this.billService = billService;
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<CustomerDashboardStats>> getDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        CustomerDashboardStats stats = dashboardService.getCustomerStats(userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<User>> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        // Mask passwordHash
        user.setPasswordHash(null);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<User>> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                          @RequestBody Map<String, String> body) {
        User user = userRepository.findById(userDetails.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (body.containsKey("name") && !body.get("name").isBlank()) {
            user.setName(body.get("name").trim());
        }
        if (body.containsKey("phone") && !body.get("phone").isBlank()) {
            user.setPhone(body.get("phone").trim());
        }
        if (body.containsKey("address") && !body.get("address").isBlank()) {
            user.setAddress(body.get("address").trim());
        }
        User saved = userRepository.save(user);
        saved.setPasswordHash(null);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", saved));
    }

    @GetMapping("/bills")
    public ResponseEntity<ApiResponse<List<Bill>>> getBills(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) BillStatus status) {
        List<Bill> bills = billService.getBillsForCustomer(userDetails.getUser().getId(), status);
        return ResponseEntity.ok(ApiResponse.ok(bills));
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<Payment>>> getPayments(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Payment> payments = paymentService.getPaymentsForCustomer(userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.ok(payments));
    }

    @PostMapping("/pay")
    public ResponseEntity<ApiResponse<Payment>> makePayment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PaymentRequest request) {
        Payment payment = paymentService.processPayment(userDetails.getUser().getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Payment successful! Receipt generated.", payment));
    }
}
