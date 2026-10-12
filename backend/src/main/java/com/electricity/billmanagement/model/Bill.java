package com.electricity.billmanagement.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "bills")
@CompoundIndexes({
    @CompoundIndex(name = "meter_month_unique_idx", def = "{'meterId': 1, 'billingMonth': 1}", unique = true)
})
public class Bill {

    @Id
    private String id;

    @Indexed(unique = true)
    private String billNumber;

    @Indexed
    private String customerId;

    @Indexed
    private String meterId;

    private String customerName;
    private String meterNumber;

    private String billingMonth; // e.g., "2026-10" or "OCT-2026"

    private double previousReading;
    private double currentReading;
    private double unitsConsumed;

    private List<TariffBreakdownItem> tariffBreakdown = new ArrayList<>();

    private BigDecimal fixedCharges = BigDecimal.ZERO;
    private BigDecimal adjustments = BigDecimal.ZERO;
    private BigDecimal energyCharges = BigDecimal.ZERO;
    private BigDecimal totalAmount = BigDecimal.ZERO;

    private LocalDate issueDate = LocalDate.now();
    private LocalDate dueDate;

    private BillStatus status = BillStatus.UNPAID;

    private String tariffId;
    private String tariffName;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public Bill() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getMeterId() { return meterId; }
    public void setMeterId(String meterId) { this.meterId = meterId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getMeterNumber() { return meterNumber; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }

    public String getBillingMonth() { return billingMonth; }
    public void setBillingMonth(String billingMonth) { this.billingMonth = billingMonth; }

    public double getPreviousReading() { return previousReading; }
    public void setPreviousReading(double previousReading) { this.previousReading = previousReading; }

    public double getCurrentReading() { return currentReading; }
    public void setCurrentReading(double currentReading) { this.currentReading = currentReading; }

    public double getUnitsConsumed() { return unitsConsumed; }
    public void setUnitsConsumed(double unitsConsumed) { this.unitsConsumed = unitsConsumed; }

    public List<TariffBreakdownItem> getTariffBreakdown() { return tariffBreakdown; }
    public void setTariffBreakdown(List<TariffBreakdownItem> tariffBreakdown) { this.tariffBreakdown = tariffBreakdown; }

    public BigDecimal getFixedCharges() { return fixedCharges; }
    public void setFixedCharges(BigDecimal fixedCharges) { this.fixedCharges = fixedCharges; }

    public BigDecimal getAdjustments() { return adjustments; }
    public void setAdjustments(BigDecimal adjustments) { this.adjustments = adjustments; }

    public BigDecimal getEnergyCharges() { return energyCharges; }
    public void setEnergyCharges(BigDecimal energyCharges) { this.energyCharges = energyCharges; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BillStatus getStatus() { return status; }
    public void setStatus(BillStatus status) { this.status = status; }

    public String getTariffId() { return tariffId; }
    public void setTariffId(String tariffId) { this.tariffId = tariffId; }

    public String getTariffName() { return tariffName; }
    public void setTariffName(String tariffName) { this.tariffName = tariffName; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
