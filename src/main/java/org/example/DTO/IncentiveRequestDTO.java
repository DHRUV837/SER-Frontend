package org.example.DTO;



public class IncentiveRequestDTO {

    private Long userId;
    private int month;
    private int year;
    private double incentiveRate; // percentage (e.g. 5 = 5%)

    // ✅ No-arg constructor (MANDATORY for Jackson)
    public IncentiveRequestDTO() {
    }

    // ✅ Getters & Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        if (year < 2000) {
            throw new IllegalArgumentException("Invalid year");
        }
        this.year = year;
    }

    public double getIncentiveRate() {
        return incentiveRate;
    }

    public void setIncentiveRate(double incentiveRate) {
        if (incentiveRate < 0 || incentiveRate > 50) {
            throw new IllegalArgumentException(
                    "Incentive rate must be between 0 and 50 percent"
            );
        }
        this.incentiveRate = incentiveRate;
    }
}

