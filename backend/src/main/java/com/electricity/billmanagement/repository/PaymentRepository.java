package com.electricity.billmanagement.repository;

import com.electricity.billmanagement.model.Payment;
import com.electricity.billmanagement.model.PaymentStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByTransactionReference(String transactionReference);
    boolean existsByBillIdAndStatus(String billId, PaymentStatus status);
    List<Payment> findByCustomerId(String customerId, Sort sort);
    List<Payment> findByBillId(String billId);
    long countByStatus(PaymentStatus status);
}
