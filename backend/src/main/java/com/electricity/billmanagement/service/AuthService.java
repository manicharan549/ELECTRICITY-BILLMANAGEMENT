package com.electricity.billmanagement.service;

import com.electricity.billmanagement.dto.*;
import com.electricity.billmanagement.model.Meter;
import com.electricity.billmanagement.model.Role;
import com.electricity.billmanagement.model.User;
import com.electricity.billmanagement.repository.MeterRepository;
import com.electricity.billmanagement.repository.UserRepository;
import com.electricity.billmanagement.security.CustomUserDetails;
import com.electricity.billmanagement.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final MeterRepository meterRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       MeterRepository meterRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.meterRepository = meterRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new IllegalArgumentException("An account with email " + request.getEmail() + " already exists");
        }

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Public registration always assigns customer role
        User user = new User(
                request.getName().trim(),
                request.getEmail().toLowerCase().trim(),
                request.getPhone().trim(),
                request.getAddress().trim(),
                passwordEncoder.encode(request.getPassword()),
                Role.ROLE_CUSTOMER,
                true
        );
        user = userRepository.save(user);

        // Automatically assign a default electricity meter for the customer
        String meterNumber = generateUniqueMeterNumber();
        Meter meter = new Meter(
                meterNumber,
                user.getId(),
                "DOMESTIC",
                LocalDate.now(),
                true,
                0.0
        );
        meterRepository.save(meter);

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());
        claims.put("name", user.getName());
        claims.put("meterNumber", meterNumber);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails, claims);

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), meterNumber);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String meterNumber = null;
        if (user.getRole() == Role.ROLE_CUSTOMER) {
            meterNumber = meterRepository.findFirstByCustomerIdAndActive(user.getId(), true)
                    .map(Meter::getMeterNumber)
                    .orElse(null);
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());
        claims.put("name", user.getName());
        if (meterNumber != null) {
            claims.put("meterNumber", meterNumber);
        }

        String token = jwtService.generateToken(userDetails, claims);

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), meterNumber);
    }

    private String generateUniqueMeterNumber() {
        Random random = new Random();
        String meterNumber;
        do {
            meterNumber = "MTR-" + (100000 + random.nextInt(900000));
        } while (meterRepository.existsByMeterNumber(meterNumber));
        return meterNumber;
    }
}
