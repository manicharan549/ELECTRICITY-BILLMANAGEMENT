package com.electricity.billmanagement.dto;

import com.electricity.billmanagement.model.Bill;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class CustomerDashboardStats {
    private String customerId;
    private String customerName;
    private String meterNumber;
    private String meterType;
    private double currentMonthConsumption;
    private BigDecimal latestBillAmount;
    private LocalDate nextBillDueDate;
    private String latestBillStatus;
    private String latestBillId;
    private BigDecimal totalOutstandingAmount;
    private List<Bill> recentBills;
    private List<Map<String, Object>> monthlyConsumption;

    public CustomerDashboardStats() {}

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getMeterNumber() { return meterNumber; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }

    public String getMeterType() { return meterType; }
    public void setMeterType(String meterType) { this.meterType = meterType; }

    public double getCurrentMonthConsumption() { return currentMonthConsumption; }
    public void setCurrentMonthConsumption(double currentMonthConsumption) { this.currentMonthConsumption = currentMonthConsumption; }

    public BigDecimal getLatestBillAmount() { return latestBillAmount; }
    public void setLatestBillAmount(BigDecimal latestBillAmount) { this.latestBillAmount = latestBillAmount; }

    public LocalDate getNextBillDueDate() { return nextBillDueDate; }
    public void setNextBillDueDate(LocalDate nextBillDueDate) { this.nextBillDueDate = nextBillDueDate; }

    public String getLatestBillStatus() { return latestBillStatus; }
    public void setLatestBillStatus(String latestBillStatus) { this.latestBillStatus = latestBillStatus; }

    public String getLatestBillId() { return latestBillId; }
    public void setLatestBillId(String latestBillId) { this.latestBillId = latestBillId; }

    public BigDecimal getTotalOutstandingAmount() { return totalOutstandingAmount; }
    public void setTotalOutstandingAmount(BigDecimal totalOutstandingAmount) { this.totalOutstandingAmount = totalOutstandingAmount; }

    public List<Bill> getRecentBills() { return recentBills; }
    public void setRecentBills(List<Bill> recentBills) { this.recentBills = recentBills; }

    public List<Map<String, Object>> getMonthlyConsumption() { return monthlyConsumption; }
    public void setMonthlyConsumption(List<Map<String, Object>> monthlyConsumption) { this.monthlyConsumption = monthlyConsumption; }
}
