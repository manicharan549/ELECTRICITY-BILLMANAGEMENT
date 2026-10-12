package com.electricity.billmanagement.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class GenerateBillRequest {

    @NotBlank(message = "Meter ID is required")
    private String meterId;

    @NotBlank(message = "Billing month is required (e.g., 2026-10)")
    private String billingMonth;

    @NotNull(message = "Current reading is required")
    @DecimalMin(value = "0.0", message = "Reading cannot be negative")
    private Double currentReading;

    private Double previousReading; // If null, auto-retrieved from meter / last bill

    private LocalDate dueDate;

    public GenerateBillRequest() {}

    public String getMeterId() { return meterId; }
    public void setMeterId(String meterId) { this.meterId = meterId; }

    public String getBillingMonth() { return billingMonth; }
    public void setBillingMonth(String billingMonth) { this.billingMonth = billingMonth; }

    public Double getCurrentReading() { return currentReading; }
    public void setCurrentReading(Double currentReading) { this.currentReading = currentReading; }

    public Double getPreviousReading() { return previousReading; }
    public void setPreviousReading(Double previousReading) { this.previousReading = previousReading; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}
