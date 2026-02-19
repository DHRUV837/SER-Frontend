package org.example.salesincentivesystem.dto;

public class ProfileRequest {
    private String fullName;
    private String mobile;
    private String profilePhoto; // Base64 or URL

    private String role;
    private String department;
    private String orgName;
    private String branch;
    private String employeeId;
    private String manager;

    private String territory;
    private String productCategory;
    private String experienceLevel;

    private SecuritySettings security;
    private String incentiveType;
    private NotificationSettings notifications;
    private LegalSettings legal;

    // Inner Classes for nested JSON
    // Inner Classes for nested JSON
    public static class SecuritySettings {
        public boolean twoFA;
        public boolean passwordChanged;

        public boolean isTwoFA() {
            return twoFA;
        }

        public void setTwoFA(boolean twoFA) {
            this.twoFA = twoFA;
        }

        public boolean isPasswordChanged() {
            return passwordChanged;
        }

        public void setPasswordChanged(boolean passwordChanged) {
            this.passwordChanged = passwordChanged;
        }
    }

    public static class NotificationSettings {
        public boolean email;
        public boolean push;
        public boolean reports;

        public boolean isEmail() {
            return email;
        }

        public void setEmail(boolean email) {
            this.email = email;
        }

        public boolean isPush() {
            return push;
        }

        public void setPush(boolean push) {
            this.push = push;
        }

        public boolean isReports() {
            return reports;
        }

        public void setReports(boolean reports) {
            this.reports = reports;
        }
    }

    public static class LegalSettings {
        public boolean terms;
        public boolean privacy;

        public boolean isTerms() {
            return terms;
        }

        public void setTerms(boolean terms) {
            this.terms = terms;
        }

        public boolean isPrivacy() {
            return privacy;
        }

        public void setPrivacy(boolean privacy) {
            this.privacy = privacy;
        }
    }

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
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

    public SecuritySettings getSecurity() {
        return security;
    }

    public void setSecurity(SecuritySettings security) {
        this.security = security;
    }

    public String getIncentiveType() {
        return incentiveType;
    }

    public void setIncentiveType(String incentiveType) {
        this.incentiveType = incentiveType;
    }

    public NotificationSettings getNotifications() {
        return notifications;
    }

    public void setNotifications(NotificationSettings notifications) {
        this.notifications = notifications;
    }

    public LegalSettings getLegal() {
        return legal;
    }

    public void setLegal(LegalSettings legal) {
        this.legal = legal;
    }
}
