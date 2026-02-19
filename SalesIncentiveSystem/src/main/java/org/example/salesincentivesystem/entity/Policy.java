package org.example.salesincentivesystem.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type = "COMPANY"; // COMPANY or INCENTIVE

    @Column(columnDefinition = "TEXT")
    private String content; // For company policies or additional description

    @Column(columnDefinition = "TEXT")
    private String description; // Policy description

    // Incentive Policy Fields
    @Column(name = "commission_rate")
    private Double commissionRate; // Percentage (e.g., 5.0 for 5%)

    @Column(name = "min_deal_amount")
    private Double minDealAmount; // Minimum deal value for this policy

    @Column(name = "max_deal_amount")
    private Double maxDealAmount; // Maximum deal value for this policy

    @Column(name = "bonus_threshold")
    private Double bonusThreshold; // Deal amount above which bonus applies

    @Column(name = "bonus_amount")
    private Double bonusAmount; // Fixed bonus amount

    private LocalDateTime lastUpdated;

    private boolean isActive = true;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getCommissionRate() {
        return commissionRate;
    }

    public void setCommissionRate(Double commissionRate) {
        this.commissionRate = commissionRate;
    }

    public Double getMinDealAmount() {
        return minDealAmount;
    }

    public void setMinDealAmount(Double minDealAmount) {
        this.minDealAmount = minDealAmount;
    }

    public Double getMaxDealAmount() {
        return maxDealAmount;
    }

    public void setMaxDealAmount(Double maxDealAmount) {
        this.maxDealAmount = maxDealAmount;
    }

    public Double getBonusThreshold() {
        return bonusThreshold;
    }

    public void setBonusThreshold(Double bonusThreshold) {
        this.bonusThreshold = bonusThreshold;
    }

    public Double getBonusAmount() {
        return bonusAmount;
    }

    public void setBonusAmount(Double bonusAmount) {
        this.bonusAmount = bonusAmount;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
