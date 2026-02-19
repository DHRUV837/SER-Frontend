package org.example.salesincentivesystem.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, EXPIRED

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @ManyToOne
    @JoinColumn(name = "invited_by_id")
    private User invitedBy;

    private Long assignedDealId; // Optional deal assignment in advance

    public Invitation() {
    }

    public Invitation(String email, String token, User invitedBy, LocalDateTime expiryDate) {
        this.email = email;
        this.token = token;
        this.status = "PENDING";
        this.expiryDate = expiryDate;
        this.invitedBy = invitedBy;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public User getInvitedBy() {
        return invitedBy;
    }

    public void setInvitedBy(User invitedBy) {
        this.invitedBy = invitedBy;
    }

    public Long getAssignedDealId() {
        return assignedDealId;
    }

    public void setAssignedDealId(Long assignedDealId) {
        this.assignedDealId = assignedDealId;
    }
}
