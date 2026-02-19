package org.example.salesincentivesystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private java.time.LocalDate date;
    private double amount;
    private double incentive;
    private double rate; // Percentage (e.g., 5.0 or 10.0)
    private String status;

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "deals", "password", "notifications" })
    private User user;

    // NEW FIELDS - Deal Assignment Workflow (Sprint 1)
    private String dealName; // e.g. "Flipkart Q1 Expansion"
    private String organizationName; // Client/Company name
    private String dealType; // New, Renewal, Upsell, Cross-sell
    private java.time.LocalDate expectedCloseDate;
    private String priority; // LOW, MEDIUM, HIGH
    private String dealNotes; // Optional internal notes
    private Long policyId; // Link to incentive policy
    private Long createdBy; // Admin user ID who created the deal
    private java.time.LocalDateTime updatedAt; // Last modification timestamp

    // PRD MANDATORY FIELDS
    private String clientName;
    private String industry;
    private String region;
    private String currency = "₹";
    private java.time.LocalDate actualCloseDate;

    // WORKFLOW TRACKING
    private Long approvedBy;
    private java.time.LocalDateTime approvedAt;
    private boolean legacyDeal = false;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public java.time.LocalDate getDate() {
        return date;
    }

    public void setDate(java.time.LocalDate date) {
        this.date = date;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getIncentive() {
        return incentive;
    }

    public void setIncentive(double incentive) {
        this.incentive = incentive;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    private java.time.LocalDateTime createdAt;
    private String rejectionReason;

    // New fields for Smart Approvals
    private String riskLevel; // LOW, MEDIUM, HIGH
    private String adminComment;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    private String payoutStatus = "PENDING"; // PENDING, PROCESSING, PAID
    private java.time.LocalDate payoutDate;

    public String getPayoutStatus() {
        return payoutStatus;
    }

    public void setPayoutStatus(String payoutStatus) {
        this.payoutStatus = payoutStatus;
    }

    public java.time.LocalDate getPayoutDate() {
        return payoutDate;
    }

    public void setPayoutDate(java.time.LocalDate payoutDate) {
        this.payoutDate = payoutDate;
    }

    public String getAdminComment() {
        return adminComment;
    }

    public void setAdminComment(String adminComment) {
        this.adminComment = adminComment;
    }

    // Getters and Setters for NEW fields

    public String getDealName() {
        return dealName;
    }

    public void setDealName(String dealName) {
        this.dealName = dealName;
    }

    public String getDealType() {
        return dealType;
    }

    public void setDealType(String dealType) {
        this.dealType = dealType;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public java.time.LocalDate getExpectedCloseDate() {
        return expectedCloseDate;
    }

    public void setExpectedCloseDate(java.time.LocalDate expectedCloseDate) {
        this.expectedCloseDate = expectedCloseDate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getDealNotes() {
        return dealNotes;
    }

    public void setDealNotes(String dealNotes) {
        this.dealNotes = dealNotes;
    }

    public Long getPolicyId() {
        return policyId;
    }

    public void setPolicyId(Long policyId) {
        this.policyId = policyId;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public java.time.LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.time.LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public java.time.LocalDate getActualCloseDate() {
        return actualCloseDate;
    }

    public void setActualCloseDate(java.time.LocalDate actualCloseDate) {
        this.actualCloseDate = actualCloseDate;
    }

    public Long getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(Long approvedBy) {
        this.approvedBy = approvedBy;
    }

    public java.time.LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(java.time.LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public boolean isLegacyDeal() {
        return legacyDeal;
    }

    public void setLegacyDeal(boolean legacyDeal) {
        this.legacyDeal = legacyDeal;
    }
}
