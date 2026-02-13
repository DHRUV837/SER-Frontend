package org.example.salesincentivesystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "app_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // In a real app, this should be hashed!

    private String role; // ADMIN or SALES
    private String name;

    @Column(nullable = false)
    private String accountStatus = "ACTIVE"; // ACTIVE, DISABLED, LOCKED

    @Column // Let Hibernate handle type
    private Boolean onboardingCompleted = false; // New objects start as false

    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled = true;

    // --- Profile Flow Fields ---
    private String mobile;

    @Column(columnDefinition = "LONGTEXT")
    private String profilePhotoUrl;

    private String department;
    private String organizationName;
    private String branch;
    private String jobTitle;
    private String managerName;
    private String territory;
    private String productCategory;
    private String experienceLevel;
    private Boolean security2FAEnabled = false;
    private String incentiveType;

    @Column(columnDefinition = "TEXT")
    private String notificationsConfig; // JSON string

    private Boolean legalAccepted = false;

    // --- Onboarding Checklist Progress ---
    @Column(name = "first_target_created")
    private Boolean firstTargetCreated = false;

    @Column(name = "first_deal_created")
    private Boolean firstDealCreated = false;

    @Column(name = "first_rule_configured")
    private Boolean firstRuleConfigured = false;

    @Column(name = "first_user_invited")
    private Boolean firstUserInvited = false;

    // ---------------------------

    public User() {
    }

    public User(String email, String password, String role, String name) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.accountStatus = "ACTIVE";
    }

    // Getters and Setters
    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public Boolean getOnboardingCompleted() {
        return onboardingCompleted == null ? true : onboardingCompleted;
    }

    public void setOnboardingCompleted(Boolean onboardingCompleted) {
        this.onboardingCompleted = onboardingCompleted;
    }

    public Boolean getNotificationsEnabled() {
        return notificationsEnabled == null ? true : notificationsEnabled;
    }

    public void setNotificationsEnabled(Boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // --- Profile Flow Getters/Setters ---
    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getTerritory() {
        return territory;
    }

    public void setTerritory(String territory) {
        this.territory = territory;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public Boolean getSecurity2FAEnabled() {
        return security2FAEnabled;
    }

    public void setSecurity2FAEnabled(Boolean security2FAEnabled) {
        this.security2FAEnabled = security2FAEnabled;
    }

    public String getIncentiveType() {
        return incentiveType;
    }

    public void setIncentiveType(String incentiveType) {
        this.incentiveType = incentiveType;
    }

    public String getNotificationsConfig() {
        return notificationsConfig;
    }

    public void setNotificationsConfig(String notificationsConfig) {
        this.notificationsConfig = notificationsConfig;
    }

    public Boolean getLegalAccepted() {
        return legalAccepted;
    }

    public void setLegalAccepted(Boolean legalAccepted) {
        this.legalAccepted = legalAccepted;
    }

    public Boolean getFirstTargetCreated() {
        return firstTargetCreated;
    }

    public void setFirstTargetCreated(Boolean firstTargetCreated) {
        this.firstTargetCreated = firstTargetCreated;
    }

    public Boolean getFirstDealCreated() {
        return firstDealCreated;
    }

    public void setFirstDealCreated(Boolean firstDealCreated) {
        this.firstDealCreated = firstDealCreated;
    }

    public Boolean getFirstRuleConfigured() {
        return firstRuleConfigured;
    }

    public void setFirstRuleConfigured(Boolean firstRuleConfigured) {
        this.firstRuleConfigured = firstRuleConfigured;
    }

    public Boolean getFirstUserInvited() {
        return firstUserInvited;
    }

    public void setFirstUserInvited(Boolean firstUserInvited) {
        this.firstUserInvited = firstUserInvited;
    }

    // --- Data Isolation Helper ---
    @com.fasterxml.jackson.annotation.JsonIgnore
    public boolean isAdminTypeGlobal() {
        // 1. Hardcoded Super Admin Principal
        if ("admin@test.com".equalsIgnoreCase(this.email)) {
            return true;
        }
        // 2. Explicit Global Org (Future-proofing)
        if ("ADMIN".equals(this.role) && "Global".equalsIgnoreCase(this.organizationName)) {
            return true;
        }
        return false;
    }
}
