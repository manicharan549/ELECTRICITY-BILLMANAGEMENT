package com.electricity.billmanagement.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Document(collection = "meters")
public class Meter {

    @Id
    private String id;

    @Indexed(unique = true)
    private String meterNumber;

    @Indexed
    private String customerId;

    private String meterType = "DOMESTIC"; // DOMESTIC, COMMERCIAL, INDUSTRIAL

    private LocalDate installationDate = LocalDate.now();

    private boolean active = true;

    private double lastRecordedReading = 0.0;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public Meter() {}

    public Meter(String meterNumber, String customerId, String meterType, LocalDate installationDate, boolean active, double lastRecordedReading) {
        this.meterNumber = meterNumber;
        this.customerId = customerId;
        this.meterType = meterType;
        this.installationDate = installationDate != null ? installationDate : LocalDate.now();
        this.active = active;
        this.lastRecordedReading = lastRecordedReading;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMeterNumber() { return meterNumber; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getMeterType() { return meterType; }
    public void setMeterType(String meterType) { this.meterType = meterType; }

    public LocalDate getInstallationDate() { return installationDate; }
    public void setInstallationDate(LocalDate installationDate) { this.installationDate = installationDate; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public double getLastRecordedReading() { return lastRecordedReading; }
    public void setLastRecordedReading(double lastRecordedReading) { this.lastRecordedReading = lastRecordedReading; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
