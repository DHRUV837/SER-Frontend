package org.example.salesincentivesystem.dto;

import java.util.List;

public class PerformanceSummary {
    private Long userId;
    private String userName;
    private int totalDeals;
    private int approvedDeals;
    private int rejectedDeals;
    private double approvalRate; // percentage
    private double totalIncentiveEarned;
    private double averageDealValue;
    private double consistencyScore; // New Analytic
    private String email;
    private String role;
    private String employeeCode;
    private String joiningDate;
    private String currentTier;
    private String nextTier;
    private double progressToNextTier;
    private String bestMonth;
    private Integer rank;

    private List<MonthlyTrend> monthlyTrend;

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(String joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getCurrentTier() {
        return currentTier;
    }

    public void setCurrentTier(String currentTier) {
        this.currentTier = currentTier;
    }

    public String getNextTier() {
        return nextTier;
    }

    public void setNextTier(String nextTier) {
        this.nextTier = nextTier;
    }

    public double getProgressToNextTier() {
        return progressToNextTier;
    }

    public void setProgressToNextTier(double progressToNextTier) {
        this.progressToNextTier = progressToNextTier;
    }

    public String getBestMonth() {
        return bestMonth;
    }

    public void setBestMonth(String bestMonth) {
        this.bestMonth = bestMonth;
    }

    // getters and setters
    public double getConsistencyScore() {
        return consistencyScore;
    }

    public void setConsistencyScore(double consistencyScore) {
        this.consistencyScore = consistencyScore;
    }

    public static class MonthlyTrend {
        private String month; // Format: YYYY-MM
        private int dealCount;
        private double incentiveSum;
        private double averageDealSize; // New Analytic

        // getters and setters
        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public int getDealCount() {
            return dealCount;
        }

        public void setDealCount(int dealCount) {
            this.dealCount = dealCount;
        }

        public double getIncentiveSum() {
            return incentiveSum;
        }

        public void setIncentiveSum(double incentiveSum) {
            this.incentiveSum = incentiveSum;
        }

        public double getAverageDealSize() {
            return averageDealSize;
        }

        public void setAverageDealSize(double averageDealSize) {
            this.averageDealSize = averageDealSize;
        }
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getTotalDeals() {
        return totalDeals;
    }

    public void setTotalDeals(int totalDeals) {
        this.totalDeals = totalDeals;
    }

    public int getApprovedDeals() {
        return approvedDeals;
    }

    public void setApprovedDeals(int approvedDeals) {
        this.approvedDeals = approvedDeals;
    }

    public int getRejectedDeals() {
        return rejectedDeals;
    }

    public void setRejectedDeals(int rejectedDeals) {
        this.rejectedDeals = rejectedDeals;
    }

    public double getApprovalRate() {
        return approvalRate;
    }

    public void setApprovalRate(double approvalRate) {
        this.approvalRate = approvalRate;
    }

    public double getTotalIncentiveEarned() {
        return totalIncentiveEarned;
    }

    public void setTotalIncentiveEarned(double totalIncentiveEarned) {
        this.totalIncentiveEarned = totalIncentiveEarned;
    }

    public double getAverageDealValue() {
        return averageDealValue;
    }

    public void setAverageDealValue(double averageDealValue) {
        this.averageDealValue = averageDealValue;
    }

    public List<MonthlyTrend> getMonthlyTrend() {
        return monthlyTrend;
    }

    public void setMonthlyTrend(List<MonthlyTrend> monthlyTrend) {
        this.monthlyTrend = monthlyTrend;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }
}
