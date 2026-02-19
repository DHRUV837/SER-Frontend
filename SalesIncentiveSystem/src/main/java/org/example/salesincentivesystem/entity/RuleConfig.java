package org.example.salesincentivesystem.entity;

import jakarta.persistence.*;

@Entity
public class RuleConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., "High Value Deal Alert"
    private String metric; // e.g., "DEAL_AMOUNT", "DISCOUNT_RATE", "APPROVAL_TIME"
    private String operator; // e.g., "GT" (>), "LT" (<), "EQ" (=)
    private double threshold; // e.g., 100000.0
    private String action; // e.g., "NOTIFY_ADMIN", "FLAG_RISK", "AUTO_APPROVE"
    private boolean active = true;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMetric() {
        return metric;
    }

    public void setMetric(String metric) {
        this.metric = metric;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public double getThreshold() {
        return threshold;
    }

    public void setThreshold(double threshold) {
        this.threshold = threshold;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
