package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final org.example.salesincentivesystem.service.AuditLogService auditLogService;

    public UserController(UserRepository userRepository,
            org.example.salesincentivesystem.service.AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    // GET - List all users (For Admin)
    @GetMapping
    public List<User> getAllUsers(@RequestParam(required = false) Long currentUserId) {
        System.out.println("DEBUG: Fetching users. CurrentUserID: " + currentUserId);

        // If currentUserId is provided, filter by that admin's organization
        if (currentUserId != null) {
            return userRepository.findById(currentUserId)
                    .map(admin -> {
                        System.out.println(
                                "DEBUG: Admin found: " + admin.getName() + ", Org: " + admin.getOrganizationName());

                        // 1. GLOBAL ADMIN -> See ALL
                        if (admin.isAdminTypeGlobal()) {
                            System.out.println("DEBUG: GLOBAL ADMIN detected. Returning ALL users.");
                            return userRepository.findAll();
                        }

                        // 2. ORG ADMIN -> See ONLY Org Data
                        if (admin.getOrganizationName() != null) {
                            List<User> users = userRepository.findByOrganizationName(admin.getOrganizationName());
                            System.out.println(
                                    "DEBUG: Found " + users.size() + " users for org: " + admin.getOrganizationName());
                            return users;
                        }

                        // 3. Fallback: New Admin with no org yet -> Empty list
                        System.out.println("DEBUG: Org Admin has no organization set. Returning empty list.");
                        return java.util.Collections.<User>emptyList();
                    })
                    .orElseGet(() -> {
                        System.out.println("DEBUG: Admin with ID " + currentUserId + " not found.");
                        return java.util.Collections.emptyList();
                    });
        }

        // Fallback for legacy calls (or super admin capability if needed)
        // STRICT SECURITY: If no currentUserId, return NOTHING to prevent leak.
        System.out.println("DEBUG: No currentUserId provided. returning empty list for security.");
        return java.util.Collections.emptyList();
    }

    // PATCH - Update User Details (General)
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return userRepository.findById(id).map(user -> {
            if (updates.containsKey("organizationName")) {
                user.setOrganizationName((String) updates.get("organizationName"));
            }
            if (updates.containsKey("department")) {
                user.setDepartment((String) updates.get("department"));
            }
            if (updates.containsKey("role")) {
                user.setRole((String) updates.get("role"));
            }
            // Add other fields as needed
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

    // PATCH - Update User Status (Activate/Disable)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        return userRepository.findById(id).map(user -> {
            String newStatus = updates.get("status");
            if (newStatus != null) {
                String oldStatus = user.getAccountStatus();
                user.setAccountStatus(newStatus);
                userRepository.save(user);

                // Audit Log
                auditLogService.logAction(
                        null, // Actor unknown without auth context
                        "ADMIN",
                        "UPDATE_STATUS",
                        "USER",
                        user.getId(),
                        "Changed status from " + oldStatus + " to " + newStatus);

                return ResponseEntity.ok(user);
            }
            return ResponseEntity.badRequest().body("Status is required");
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE - Remove User (For cleanup/admin purposes)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            // Audit log before deletion
            auditLogService.logAction(
                    null,
                    "ADMIN",
                    "DELETE_USER",
                    "USER",
                    user.getId(),
                    "Deleted user: " + user.getEmail());

            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully", "email", user.getEmail()));
        }).orElse(ResponseEntity.notFound().build());
    }
}
