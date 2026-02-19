package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealRepository dealRepository;
    private final UserRepository userRepository;

    public DealController(DealRepository dealRepository, UserRepository userRepository) {
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
    }

    // ✅ POST - Create a new deal
    @PostMapping
    public ResponseEntity<Deal> createDeal(@RequestBody Map<String, Object> dealData) {
        try {
            Deal deal = new Deal();
            deal.setDealName((String) dealData.get("dealName"));
            deal.setClientName((String) dealData.get("clientName"));
            deal.setAmount(Double.valueOf(dealData.get("amount").toString()));
            // Default Status
            deal.setStatus("Submitted");
            deal.setDate(java.time.LocalDate.now());

            // Handle User Association
            if (dealData.get("user") != null) {
                Map<String, Object> userMap = (Map<String, Object>) dealData.get("user");
                Long userId = Long.valueOf(userMap.get("id").toString());
                userRepository.findById(userId).ifPresent(user -> {
                    deal.setUser(user);
                    // NEW: Inherit Organization from User
                    if (user.getOrganizationName() != null) {
                        deal.setOrganizationName(user.getOrganizationName());
                    }
                });
            }

            Deal savedDeal = dealRepository.save(deal);
            return ResponseEntity.ok(savedDeal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ✅ GET - fetch deal history (Enhanced for Data Isolation)
    @GetMapping
    public List<Deal> getAllDeals(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long requestorId) {

        // 1. Resolve Security Context (Who is asking?)
        org.example.salesincentivesystem.entity.User requestor = null;
        if (requestorId != null) {
            requestor = userRepository.findById(requestorId).orElse(null);
        }

        // 2. Scenario: Fetching Specific User's Deals
        if (userId != null) {
            return dealRepository.findAll().stream()
                    .filter(d -> d.getUser() != null && d.getUser().getId().equals(userId))
                    .collect(java.util.stream.Collectors.toList());
        }

        // 3. Scenario: Admin OR Sales Fetching Deals (Dashboard/Leaderboard)
        if (requestor != null) {
            String role = requestor.getRole();
            String orgName = requestor.getOrganizationName();

            // 3a. Global Admin -> All Deals
            if ("ADMIN".equals(role) && requestor.isAdminTypeGlobal()) {
                return dealRepository.findAll();
            }

            // 3b. Org Admin OR Sales Rep -> Org Deals
            if (orgName != null) {
                return dealRepository.findByUser_OrganizationName(orgName);
            } else {
                final org.example.salesincentivesystem.entity.User finalRequestor = requestor;
                return dealRepository.findAll().stream()
                        .filter(d -> d.getUser() != null && d.getUser().getId().equals(finalRequestor.getId()))
                        .collect(java.util.stream.Collectors.toList());
            }
        }

        // Default to EMPTY
        return java.util.Collections.emptyList();
    }

    // ✅ PATCH - update status (Approve/Reject)
    // ✅ PATCH - update status (Approve/Reject)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Deal> updateDealStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        return dealRepository.findById(id).map(deal -> {
            String newStatus = statusUpdate.get("status");
            deal.setStatus(newStatus);

            // Handle Rejection Reason
            if (statusUpdate.containsKey("reason")) {
                deal.setRejectionReason(statusUpdate.get("reason"));
            }

            // Handle Admin Comment
            if (statusUpdate.containsKey("comment")) {
                deal.setAdminComment(statusUpdate.get("comment"));
            }

            // If approved, set actual close date & timestamps
            if ("Approved".equalsIgnoreCase(newStatus)) {
                deal.setActualCloseDate(java.time.LocalDate.now());
                deal.setApprovedAt(java.time.LocalDateTime.now());
                // Calculate Incentive (Simple 5% logic for demo)
                if (deal.getAmount() > 0) {
                    deal.setIncentive(deal.getAmount() * 0.05);
                }
            }

            return ResponseEntity.ok(dealRepository.save(deal));
        }).orElse(ResponseEntity.notFound().build());
    }
}
