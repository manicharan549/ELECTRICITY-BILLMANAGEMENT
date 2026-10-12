package com.electricity.billmanagement.dto;

import com.electricity.billmanagement.model.Role;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private String id;
    private String name;
    private String email;
    private Role role;
    private String meterNumber;

    public AuthResponse() {}

    public AuthResponse(String token, String id, String name, String email, Role role, String meterNumber) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.meterNumber = meterNumber;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getMeterNumber() { return meterNumber; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }
}
