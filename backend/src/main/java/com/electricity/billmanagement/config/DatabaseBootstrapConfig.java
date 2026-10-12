package com.electricity.billmanagement.config;

import com.electricity.billmanagement.model.Role;
import com.electricity.billmanagement.model.Tariff;
import com.electricity.billmanagement.model.TariffSlab;
import com.electricity.billmanagement.model.User;
import com.electricity.billmanagement.repository.TariffRepository;
import com.electricity.billmanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DatabaseBootstrapConfig implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseBootstrapConfig.class);

    private final UserRepository userRepository;
    private final TariffRepository tariffRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.email:admin@electricity.gov.in}")
    private String adminEmail;

    @Value("${app.bootstrap.admin.password:Admin@12345}")
    private String adminPassword;

    @Value("${app.bootstrap.admin.name:System Administrator}")
    private String adminName;

    @Value("${app.bootstrap.admin.phone:9876543210}")
    private String adminPhone;

    @Value("${app.bootstrap.admin.address:Power Utility Central Office, New Delhi}")
    private String adminAddress;

    public DatabaseBootstrapConfig(UserRepository userRepository,
                                   TariffRepository tariffRepository,
                                   PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tariffRepository = tariffRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        bootstrapAdminUser();
        bootstrapDefaultTariff();
    }

    private void bootstrapAdminUser() {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User(
                    adminName,
                    adminEmail,
                    adminPhone,
                    adminAddress,
                    passwordEncoder.encode(adminPassword),
                    Role.ROLE_ADMIN,
                    true
            );
            userRepository.save(admin);
            log.info("Successfully bootstrapped initial Administrator account: {}", adminEmail);
        } else {
            log.info("Administrator account already exists: {}", adminEmail);
        }
    }

    private void bootstrapDefaultTariff() {
        if (tariffRepository.count() == 0) {
            List<TariffSlab> slabs = new ArrayList<>();
            // Slabs based on Master Specification:
            // 0 - 100 units: ₹2/unit
            // 101 - 200 units: ₹3/unit
            // Above 200 units: ₹5/unit
            slabs.add(new TariffSlab(0, 100, BigDecimal.valueOf(2.00)));
            slabs.add(new TariffSlab(100, 200, BigDecimal.valueOf(3.00)));
            slabs.add(new TariffSlab(200, Double.MAX_VALUE, BigDecimal.valueOf(5.00)));

            Tariff defaultTariff = new Tariff(
                    "Standard Domestic Slab 2026",
                    slabs,
                    BigDecimal.valueOf(50.00), // Fixed monthly service charge ₹50
                    LocalDate.now().minusMonths(6),
                    true
            );
            tariffRepository.save(defaultTariff);
            log.info("Successfully bootstrapped default electricity tariff rates with progressive slabs.");
        }
    }
}
