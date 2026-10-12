package com.electricity.billmanagement.repository;

import com.electricity.billmanagement.model.Role;
import com.electricity.billmanagement.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByRoleAndActive(Role role, boolean active);
    long countByRole(Role role);
    long countByRoleAndActive(Role role, boolean active);
}
