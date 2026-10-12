package com.electricity.billmanagement.controller;

import com.electricity.billmanagement.dto.ApiResponse;
import com.electricity.billmanagement.model.Bill;
import com.electricity.billmanagement.model.Role;
import com.electricity.billmanagement.model.User;
import com.electricity.billmanagement.security.CustomUserDetails;
import com.electricity.billmanagement.service.BillService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Bill>> getBillById(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Bill bill = billService.getBillById(id);
        User currentUser = userDetails.getUser();

        // Customer can only view their own bill; Admin can view any bill
        if (currentUser.getRole() == Role.ROLE_CUSTOMER && !bill.getCustomerId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(ApiResponse.error("Unauthorized: You do not have permission to view this invoice"));
        }

        return ResponseEntity.ok(ApiResponse.ok(bill));
    }
}
