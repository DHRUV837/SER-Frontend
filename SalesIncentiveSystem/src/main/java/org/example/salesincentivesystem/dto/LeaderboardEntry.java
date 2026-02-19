package org.example.salesincentivesystem.dto;

public class LeaderboardEntry {
    private Long userId;
    private String name;
    private Double totalIncentive;
    private Integer deals;
    private Double totalAmount;
    private Double avgDealSize;
    private Double winRate;
    private Integer rank;
    private Integer trend; // Rank change from previous period (positive = moved up)

    // Constructors
    public LeaderboardEntry() {
    }

    public LeaderboardEntry(Long userId, String name, Double totalIncentive, Integer deals, Double totalAmount) {
        this.userId = userId;
        this.name = name;
        this.totalIncentive = totalIncentive;
        this.deals = deals;
        this.totalAmount = totalAmount;
        this.avgDealSize = deals > 0 ? totalAmount / deals : 0.0;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getTotalIncentive() {
        return totalIncentive;
    }

    public void setTotalIncentive(Double totalIncentive) {
        this.totalIncentive = totalIncentive;
    }

    public Integer getDeals() {
        return deals;
    }

    public void setDeals(Integer deals) {
        this.deals = deals;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Double getAvgDealSize() {
        return avgDealSize;
    }

    public void setAvgDealSize(Double avgDealSize) {
        this.avgDealSize = avgDealSize;
    }

    public Double getWinRate() {
        return winRate;
    }

    public void setWinRate(Double winRate) {
        this.winRate = winRate;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Integer getTrend() {
        return trend;
    }

    public void setTrend(Integer trend) {
        this.trend = trend;
    }
}
