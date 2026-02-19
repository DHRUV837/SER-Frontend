package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Policy;
import org.example.salesincentivesystem.repository.PolicyRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/policy")
public class PolicyController {

    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;

    public PolicyController(PolicyRepository policyRepository, UserRepository userRepository) {
        this.policyRepository = policyRepository;
        this.userRepository = userRepository;
    }

    // Public/Sales: Get all active policies
    @GetMapping
    public List<Policy> getActivePolicies(@RequestParam(required = false) String type) {
        if (type != null) {
            return policyRepository.findByTypeAndIsActiveTrue(type);
        }
        return policyRepository.findByIsActiveTrue();
    }

    // Admin: Get all (including inactive/drafts)
    @GetMapping("/admin")
    public List<Policy> getAllPolicies(@RequestParam(required = false) String type) {
        if (type != null) {
            return policyRepository.findByType(type);
        }
        return policyRepository.findAll();
    }

    // Admin: Create or Update Policy
    @PostMapping
    public Policy savePolicy(@RequestBody Map<String, Object> payload) {
        Policy policy = new Policy();

        // Handle both new and existing policies
        if (payload.containsKey("id") && payload.get("id") != null) {
            Long id = Long.parseLong(payload.get("id").toString());
            policy = policyRepository.findById(id).orElse(new Policy());
        }

        // Set policy fields from payload (using correct field names from Policy entity)
        if (payload.containsKey("title")) {
            policy.setTitle((String) payload.get("title"));
        }
        if (payload.containsKey("type")) {
            policy.setType((String) payload.get("type"));
        }
        if (payload.containsKey("description")) {
            policy.setDescription((String) payload.get("description"));
        }
        if (payload.containsKey("content")) {
            policy.setContent((String) payload.get("content"));
        }
        if (payload.containsKey("commissionRate")) {
            policy.setCommissionRate(Double.parseDouble(payload.get("commissionRate").toString()));
        }
        if (payload.containsKey("isActive")) {
            policy.setActive(Boolean.parseBoolean(payload.get("isActive").toString()));
        }

        policy.setLastUpdated(LocalDateTime.now());
        Policy savedPolicy = policyRepository.save(policy);

        // AUTO-TRACK ONBOARDING: Mark firstRuleConfigured for the admin who
        // created/activated this policy
        if (payload.containsKey("createdBy") && savedPolicy.isActive()) {
            try {
                Long adminId = Long.parseLong(payload.get("createdBy").toString());
                userRepository.findById(adminId).ifPresent(admin -> {
                    if (Boolean.FALSE.equals(admin.getFirstRuleConfigured())) {
                        admin.setFirstRuleConfigured(true);
                        userRepository.save(admin);
                    }
                });
            } catch (Exception ignored) {
                // Silently fail if onboarding tracking fails
            }
        }

        return savedPolicy;
    }

    // Admin: Delete (Soft or Hard)
    @DeleteMapping("/{id}")
    public void deletePolicy(@PathVariable Long id) {
        policyRepository.deleteById(id);
    }
}
