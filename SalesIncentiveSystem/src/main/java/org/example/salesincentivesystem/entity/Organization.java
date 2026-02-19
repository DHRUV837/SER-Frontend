package org.example.salesincentivesystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String industry;
    private String companySize;
    private String currency; // e.g., INR, USD
    private String fiscalYear; // e.g., "April-March"

    @OneToOne
    @JoinColumn(name = "admin_user_id", referencedColumnName = "id")
    private User adminUser;

    public Organization() {
    }

    public Organization(String name, String industry, String companySize, String currency, String fiscalYear,
            User adminUser) {
        this.name = name;
        this.industry = industry;
        this.companySize = companySize;
        this.currency = currency;
        this.fiscalYear = fiscalYear;
        this.adminUser = adminUser;
    }

    // Getters and Setters

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

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getCompanySize() {
        return companySize;
    }

    public void setCompanySize(String companySize) {
        this.companySize = companySize;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getFiscalYear() {
        return fiscalYear;
    }

    public void setFiscalYear(String fiscalYear) {
        this.fiscalYear = fiscalYear;
    }

    public User getAdminUser() {
        return adminUser;
    }

    public void setAdminUser(User adminUser) {
        this.adminUser = adminUser;
    }
}
