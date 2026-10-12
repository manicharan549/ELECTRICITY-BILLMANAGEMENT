package com.electricity.billmanagement.repository;

import com.electricity.billmanagement.model.Tariff;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TariffRepository extends MongoRepository<Tariff, String> {
    Optional<Tariff> findFirstByActiveTrueOrderByEffectiveFromDesc();
    List<Tariff> findByActive(boolean active);
}
