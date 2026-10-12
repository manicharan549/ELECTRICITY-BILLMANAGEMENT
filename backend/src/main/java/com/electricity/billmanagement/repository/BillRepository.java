package com.electricity.billmanagement.repository;

import com.electricity.billmanagement.model.Bill;
import com.electricity.billmanagement.model.BillStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends MongoRepository<Bill, String> {
    Optional<Bill> findByBillNumber(String billNumber);
    boolean existsByMeterIdAndBillingMonth(String meterId, String billingMonth);
    List<Bill> findByCustomerId(String customerId, Sort sort);
    List<Bill> findByCustomerIdAndStatus(String customerId, BillStatus status, Sort sort);
    List<Bill> findByMeterId(String meterId, Sort sort);
    Optional<Bill> findFirstByMeterIdOrderByIssueDateDesc(String meterId);
    long countByStatus(BillStatus status);
}
