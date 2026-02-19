package org.example.salesincentivesystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sales_performance")
public class SalesPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private Double currentMonthTarget;
    private Double performanceRating; // 1.0 to 5.0
    private String achievements; // Comma separated for MVP

    public SalesPerformance() {
    }

    public SalesPerformance(User user, Double currentMonthTarget, Double performanceRating, String achievements) {
        this.user = user;
        this.currentMonthTarget = currentMonthTarget;
        this.performanceRating = performanceRating;
        this.achievements = achievements;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Double getCurrentMonthTarget() {
        return currentMonthTarget;
    }

    public void setCurrentMonthTarget(Double currentMonthTarget) {
        this.currentMonthTarget = currentMonthTarget;
    }

    public Double getPerformanceRating() {
        return performanceRating;
    }

    public void setPerformanceRating(Double performanceRating) {
        this.performanceRating = performanceRating;
    }

    public String getAchievements() {
        return achievements;
    }

    public void setAchievements(String achievements) {
        this.achievements = achievements;
    }
}
