package org.example.salesincentivesystem.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.DealRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.example.salesincentivesystem.repository.NotificationRepository;
import org.example.salesincentivesystem.service.AuditLogService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/deals")
public class AdminDealController {

    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final org.example.salesincentivesystem.repository.PolicyRepository policyRepository;
    private final AuditLogService auditLogService;

    public AdminDealController(
            DealRepository dealRepository,
            UserRepository userRepository,
            NotificationRepository notificationRepository,
            org.example.salesincentivesystem.repository.PolicyRepository policyRepository,
            AuditLogService auditLogService) {
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.policyRepository = policyRepository;
        this.auditLogService = auditLogService;
    }

    /**
     * Admin creates and assigns a new deal to a sales executive
     * Status: ASSIGNED
     */
    @PostMapping
    public org.springframework.http.ResponseEntity<?> createDeal(@RequestBody Map<String, Object> payload) {
        try {
            Deal deal = new Deal();

            // Extract and validate all required fields
            String dealName = (String) payload.get("dealName");
            if (dealName == null || dealName.trim().isEmpty()) {
                return org.springframework.http.ResponseEntity.badRequest().body("Deal Name is required");
            }
            deal.setDealName(dealName);

            String orgName = (String) payload.get("organizationName");
            if (orgName == null || orgName.trim().isEmpty()) {
                return org.springframework.http.ResponseEntity.badRequest().body("Organization Name is required");
            }
            deal.setOrganizationName(orgName);

            // PRD MANDATORY FIELDS
            deal.setClientName((String) payload.getOrDefault("clientName", orgName));
            deal.setIndustry((String) payload.getOrDefault("industry", "Uncategorized"));
            deal.setRegion((String) payload.getOrDefault("region", "Global"));
            deal.setCurrency((String) payload.getOrDefault("currency", "₹"));

            double amount = Double.parseDouble(payload.get("amount").toString());
            if (amount <= 0) {
                return org.springframework.http.ResponseEntity.badRequest().body("Amount must be greater than 0");
            }
            deal.setAmount(amount);

            String priority = (String) payload.get("priority");
            if (priority == null || priority.trim().isEmpty()) {
                priority = "MEDIUM"; // Default
            }
            deal.setPriority(priority);

            // Deal Type
            String dealType = (String) payload.get("dealType");
            if (dealType != null && !dealType.trim().isEmpty()) {
                // Validate against allowed values
                if (dealType.matches("NEW|RENEWAL|UPSELL|CROSS_SELL")) {
                    deal.setDealType(dealType);
                } else {
                    return org.springframework.http.ResponseEntity.badRequest()
                            .body("Invalid dealType. Must be one of: NEW, RENEWAL, UPSELL, CROSS_SELL");
                }
            } else {
                deal.setDealType("NEW"); // Default to NEW if not provided
            }

            // Expected close date
            if (payload.containsKey("expectedCloseDate")) {
                java.time.LocalDate closeDate = java.time.LocalDate.parse((String) payload.get("expectedCloseDate"));

                // Allow backdating for "Legacy" deals or corrections, but suggest future.
                // Strict check:
                if (closeDate.isBefore(java.time.LocalDate.now())) {
                    return org.springframework.http.ResponseEntity.badRequest()
                            .body("Expected Close Date cannot be in the past (" + closeDate + ")");
                }
                deal.setExpectedCloseDate(closeDate);
            }

            // Policy ID & Incentive Calculation
            if (payload.containsKey("policyId")) {
                try {
                    Long policyId = Long.parseLong(payload.get("policyId").toString());
                    deal.setPolicyId(policyId);

                    policyRepository.findById(policyId).ifPresent(policy -> {
                        if (policy.getCommissionRate() != null) {
                            deal.setRate(policy.getCommissionRate());
                            deal.setIncentive((deal.getAmount() * policy.getCommissionRate()) / 100.0);
                        }
                    });
                } catch (Exception e) {
                    // Ignore invalid policy ID
                }
            }

            // Fallback rate
            if (deal.getRate() == 0.0) {
                if (deal.getAmount() <= 50000) {
                    deal.setRate(5.0);
                    deal.setIncentive(deal.getAmount() * 0.05);
                } else {
                    deal.setRate(10.0);
                    deal.setIncentive(deal.getAmount() * 0.10);
                }
            }

            // Notes
            if (payload.containsKey("dealNotes")) {
                deal.setDealNotes((String) payload.get("dealNotes"));
            }

            // Sales Exec
            Long assignedUserId = Long.parseLong(payload.get("assignedUserId").toString());
            User salesExec = userRepository.findById(assignedUserId)
                    .orElseThrow(() -> new RuntimeException("Sales Executive not found"));

            if (!"SALES".equals(salesExec.getRole())) {
                return org.springframework.http.ResponseEntity.badRequest()
                        .body("Can only assign deals to users with SALES role");
            }

            deal.setUser(salesExec);

            if (payload.containsKey("createdBy")) {
                deal.setCreatedBy(Long.parseLong(payload.get("createdBy").toString()));
            }

            deal.setDate(java.time.LocalDate.now());
            deal.setCreatedAt(LocalDateTime.now());
            deal.setUpdatedAt(LocalDateTime.now());
            deal.setStatus("ASSIGNED");

            Deal savedDeal = dealRepository.save(deal);

            // AUTO-TRACK ONBOARDING: Mark firstDealCreated for the admin who created this
            // deal
            if (payload.containsKey("createdBy")) {
                try {
                    Long adminId = Long.parseLong(payload.get("createdBy").toString());
                    userRepository.findById(adminId).ifPresent(admin -> {
                        if (Boolean.FALSE.equals(admin.getFirstDealCreated())) {
                            admin.setFirstDealCreated(true);
                            userRepository.save(admin);
                        }
                    });
                } catch (Exception ignored) {
                    // Silently fail if onboarding tracking fails
                }
            }

            // Notify
            try {
                org.example.salesincentivesystem.entity.Notification notification = new org.example.salesincentivesystem.entity.Notification();
                notification.setUser(salesExec);
                notification.setTitle("New Deal Assigned: " + savedDeal.getDealName());
                notification.setMessage("You have been assigned a new deal for " + savedDeal.getOrganizationName()
                        + " worth ₹" + savedDeal.getAmount());
                notification.setType("INFO");
                notification.setTimestamp(LocalDateTime.now());
                notificationRepository.save(notification);
            } catch (Exception ignored) {
            }

            // Audit
            try {
                auditLogService.logAction(
                        null, "ADMIN", "CREATE_DEAL_ASSIGNED", "DEAL", savedDeal.getId(),
                        String.format("Created and assigned deal '%s' to %s", savedDeal.getDealName(),
                                salesExec.getName()));
            } catch (Exception ignored) {
            }

            return org.springframework.http.ResponseEntity.ok(savedDeal);

        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity
                    .status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating deal: " + e.getMessage());
        }
    }

    /**
     * Admin updates deal details (before approval)
     */
    @PutMapping("/{id}")
    public Deal updateDeal(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found"));

        // Can only edit if not yet approved
        if ("APPROVED".equals(deal.getStatus())) {
            throw new RuntimeException("Cannot modify approved deals");
        }

        // Update allowed fields
        if (payload.containsKey("dealName")) {
            deal.setDealName((String) payload.get("dealName"));
        }
        if (payload.containsKey("organizationName")) {
            deal.setOrganizationName((String) payload.get("organizationName"));
        }
        if (payload.containsKey("clientName")) {
            deal.setClientName((String) payload.get("clientName"));
        }
        if (payload.containsKey("industry")) {
            deal.setIndustry((String) payload.get("industry"));
        }
        if (payload.containsKey("region")) {
            deal.setRegion((String) payload.get("region"));
        }
        if (payload.containsKey("currency")) {
            deal.setCurrency((String) payload.get("currency"));
        }
        if (payload.containsKey("amount")) {
            deal.setAmount(Double.parseDouble(payload.get("amount").toString()));
        }
        if (payload.containsKey("priority")) {
            deal.setPriority((String) payload.get("priority"));
        }
        if (payload.containsKey("expectedCloseDate")) {
            deal.setExpectedCloseDate(
                    java.time.LocalDate.parse((String) payload.get("expectedCloseDate")));
        }
        if (payload.containsKey("dealNotes")) {
            deal.setDealNotes((String) payload.get("dealNotes"));
        }

        deal.setUpdatedAt(LocalDateTime.now());

        Deal updatedDeal = dealRepository.save(deal);

        // Audit log
        auditLogService.logAction(
                null,
                "ADMIN",
                "UPDATE_DEAL",
                "DEAL",
                updatedDeal.getId(),
                "Updated deal: " + updatedDeal.getDealName());

        return updatedDeal;
    }

    /**
     * Admin gets all deals with optional filters
     */
    @GetMapping
    public List<Deal> getAllDeals(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String priority) {

        List<Deal> allDeals = dealRepository.findAll();

        // Apply filters
        return allDeals.stream()
                .filter(d -> status == null || status.equals(d.getStatus()))
                .filter(d -> userId == null || (d.getUser() != null && userId.equals(d.getUser().getId())))
                .filter(d -> priority == null || priority.equals(d.getPriority()))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Admin reassigns deal to different sales executive
     */
    @PatchMapping("/{id}/reassign")
    public Deal reassignDeal(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found"));

        Long newUserId = Long.parseLong(payload.get("newUserId").toString());
        User newSalesExec = userRepository.findById(newUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"SALES".equals(newSalesExec.getRole())) {
            throw new RuntimeException("Can only assign to SALES role");
        }

        User oldUser = deal.getUser();
        deal.setUser(newSalesExec);
        deal.setUpdatedAt(LocalDateTime.now());

        Deal savedDeal = dealRepository.save(deal);

        // Notify new assignee
        org.example.salesincentivesystem.entity.Notification notification = new org.example.salesincentivesystem.entity.Notification();
        notification.setUser(newSalesExec);
        notification.setTitle("Deal Reassigned: " + savedDeal.getDealName());
        notification.setMessage("Deal has been reassigned to you");
        notification.setType("INFO");
        notification.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notification);

        // Audit log
        auditLogService.logAction(
                null,
                "ADMIN",
                "REASSIGN_DEAL",
                "DEAL",
                savedDeal.getId(),
                "Reassigned deal from " + (oldUser != null ? oldUser.getName() : "none")
                        + " to " + newSalesExec.getName());

        return savedDeal;
    }

    /**
     * Admin gets a single deal by ID
     */
    @GetMapping("/{id}")
    public Deal getDealById(@PathVariable Long id) {
        return dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found"));
    }
}
