package com.electricity.billmanagement.service;

import com.electricity.billmanagement.dto.PaymentRequest;
import com.electricity.billmanagement.model.Bill;
import com.electricity.billmanagement.model.BillStatus;
import com.electricity.billmanagement.model.Payment;
import com.electricity.billmanagement.model.PaymentStatus;
import com.electricity.billmanagement.repository.BillRepository;
import com.electricity.billmanagement.repository.PaymentRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BillRepository billRepository;

    public PaymentService(PaymentRepository paymentRepository, BillRepository billRepository) {
        this.paymentRepository = paymentRepository;
        this.billRepository = billRepository;
    }

    public synchronized Payment processPayment(String customerId, PaymentRequest request) {
        Bill bill = billRepository.findById(request.getBillId())
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + request.getBillId()));

        if (customerId != null && !bill.getCustomerId().equals(customerId)) {
            throw new SecurityException("Unauthorized: You cannot pay a bill belonging to another customer");
        }

        if (bill.getStatus() == BillStatus.PAID) {
            throw new IllegalStateException("Bill " + bill.getBillNumber() + " is already marked as PAID");
        }

        if (paymentRepository.existsByBillIdAndStatus(bill.getId(), PaymentStatus.SUCCESS)) {
            throw new IllegalStateException("A successful payment has already been recorded for bill " + bill.getBillNumber());
        }

        // Create simulated payment transaction
        Payment payment = new Payment();
        String txRef = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        payment.setTransactionReference(txRef);
        payment.setBillId(bill.getId());
        payment.setBillNumber(bill.getBillNumber());
        payment.setCustomerId(bill.getCustomerId());
        payment.setCustomerName(bill.getCustomerName());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setRemarks(request.getRemarks() != null ? request.getRemarks() : "Demonstration simulated payment");

        Payment savedPayment = paymentRepository.save(payment);

        // Update bill status atomically
        bill.setStatus(BillStatus.PAID);
        billRepository.save(bill);

        return savedPayment;
    }

    public List<Payment> getPaymentsForCustomer(String customerId) {
        return paymentRepository.findByCustomerId(customerId, Sort.by(Sort.Direction.DESC, "paymentDate"));
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll(Sort.by(Sort.Direction.DESC, "paymentDate"));
    }

    public Payment getPaymentById(String id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment record not found with ID: " + id));
    }
}
