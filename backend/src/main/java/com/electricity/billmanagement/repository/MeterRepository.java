package com.electricity.billmanagement.repository;

import com.electricity.billmanagement.model.Meter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeterRepository extends MongoRepository<Meter, String> {
    Optional<Meter> findByMeterNumber(String meterNumber);
    boolean existsByMeterNumber(String meterNumber);
    List<Meter> findByCustomerId(String customerId);
    Optional<Meter> findFirstByCustomerIdAndActive(String customerId, boolean active);
}
