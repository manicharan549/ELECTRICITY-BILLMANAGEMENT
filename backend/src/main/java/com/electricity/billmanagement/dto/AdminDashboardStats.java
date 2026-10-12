package com.electricity.billmanagement.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminDashboardStats {
    private long totalCustomers;
    private long activeCustomers;
    private long totalBills;
    private long paidBills;
    private long unpaidBills;
    private long overdueBills;
    private long totalRecordedPayments;
    private BigDecimal totalRevenueCollected;
    private List<Map<String, Object>> monthlyRevenue;
    private List<Map<String, Object>> monthlyConsumption;

    public AdminDashboardStats() {}

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getActiveCustomers() { return activeCustomers; }
    public void setActiveCustomers(long activeCustomers) { this.activeCustomers = activeCustomers; }

    public long getTotalBills() { return totalBills; }
    public void setTotalBills(long totalBills) { this.totalBills = totalBills; }

    public long getPaidBills() { return paidBills; }
    public void setPaidBills(long paidBills) { this.paidBills = paidBills; }

    public long getUnpaidBills() { return unpaidBills; }
    public void setUnpaidBills(long unpaidBills) { this.unpaidBills = unpaidBills; }

    public long getOverdueBills() { return overdueBills; }
    public void setOverdueBills(long overdueBills) { this.overdueBills = overdueBills; }

    public long getTotalRecordedPayments() { return totalRecordedPayments; }
    public void setTotalRecordedPayments(long totalRecordedPayments) { this.totalRecordedPayments = totalRecordedPayments; }

    public BigDecimal getTotalRevenueCollected() { return totalRevenueCollected; }
    public void setTotalRevenueCollected(BigDecimal totalRevenueCollected) { this.totalRevenueCollected = totalRevenueCollected; }

    public List<Map<String, Object>> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(List<Map<String, Object>> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public List<Map<String, Object>> getMonthlyConsumption() { return monthlyConsumption; }
    public void setMonthlyConsumption(List<Map<String, Object>> monthlyConsumption) { this.monthlyConsumption = monthlyConsumption; }
}
