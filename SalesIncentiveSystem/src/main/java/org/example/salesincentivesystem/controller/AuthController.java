package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final UserRepository userRepository;
        private final org.example.salesincentivesystem.repository.AuditLogRepository auditLogRepository;
        private final org.example.salesincentivesystem.repository.SalesProfileRepository salesProfileRepository;
        private final org.example.salesincentivesystem.repository.UserPreferenceRepository userPreferenceRepository;
        private final org.example.salesincentivesystem.repository.SalesPerformanceRepository salesPerformanceRepository;
        private final org.example.salesincentivesystem.service.EmailService emailService;
        private final org.example.salesincentivesystem.service.InvitationService invitationService;
        private final org.example.salesincentivesystem.repository.DealRepository dealRepository;

        public AuthController(UserRepository userRepository,
                        org.example.salesincentivesystem.repository.AuditLogRepository auditLogRepository,
                        org.example.salesincentivesystem.repository.SalesProfileRepository salesProfileRepository,
                        org.example.salesincentivesystem.repository.UserPreferenceRepository userPreferenceRepository,
                        org.example.salesincentivesystem.repository.SalesPerformanceRepository salesPerformanceRepository,
                        org.example.salesincentivesystem.service.EmailService emailService,
                        org.example.salesincentivesystem.service.InvitationService invitationService,
                        org.example.salesincentivesystem.repository.DealRepository dealRepository) {
                this.userRepository = userRepository;
                this.auditLogRepository = auditLogRepository;
                this.salesProfileRepository = salesProfileRepository;
                this.userPreferenceRepository = userPreferenceRepository;
                this.salesPerformanceRepository = salesPerformanceRepository;
                this.emailService = emailService;
                this.invitationService = invitationService;
                this.dealRepository = dealRepository;
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
                String email = credentials.get("email");
                String password = credentials.get("password");

                String ipAddress = "127.0.0.1"; // Placeholder for local dev

                Optional<User> userOpt = userRepository.findByEmail(email);

                if (userOpt.isPresent()) {
                        User user = userOpt.get();

                        // Check Account Status
                        if ("LOCKED".equals(user.getAccountStatus()) || "DISABLED".equals(user.getAccountStatus())) {
                                auditLogRepository.save(new org.example.salesincentivesystem.entity.AuditLog(
                                                user.getId(), email,
                                                "LOGIN_FAIL_" + user.getAccountStatus(), ipAddress));
                                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                                .body("Account is " + user.getAccountStatus());
                        }

                        if (user.getPassword().equals(password)) {
                                auditLogRepository.save(new org.example.salesincentivesystem.entity.AuditLog(
                                                user.getId(), email,
                                                "LOGIN_SUCCESS", ipAddress));

                                org.example.salesincentivesystem.entity.UserPreference pref = userPreferenceRepository
                                                .findByUserId(user.getId())
                                                .orElse(null);

                                org.example.salesincentivesystem.entity.SalesProfile userProfile = salesProfileRepository
                                                .findByUserId(user.getId())
                                                .orElse(null);

                                org.example.salesincentivesystem.entity.SalesPerformance perf = salesPerformanceRepository
                                                .findByUserId(user.getId())
                                                .orElse(null);

                                Map<String, Object> response = new java.util.HashMap<>();
                                response.put("token", "dummy-jwt-token-" + user.getId());

                                // Add organizationName to user object for frontend access
                                Map<String, Object> userWithOrg = new java.util.HashMap<>();
                                userWithOrg.put("id", user.getId());
                                userWithOrg.put("email", user.getEmail());
                                userWithOrg.put("name", user.getName());
                                userWithOrg.put("role", user.getRole());
                                userWithOrg.put("accountStatus", user.getAccountStatus());
                                userWithOrg.put("onboardingCompleted", user.getOnboardingCompleted());
                                // Get company name from User entity
                                userWithOrg.put("organizationName",
                                                user.getOrganizationName() != null ? user.getOrganizationName()
                                                                : "Your Company");

                                response.put("user", userWithOrg);
                                // Restore top-level fields for Frontend compatibility
                                response.put("role", user.getRole());
                                response.put("name", user.getName());
                                response.put("email", user.getEmail());
                                response.put("status", user.getAccountStatus());

                                response.put("profile", userProfile);
                                response.put("preferences", pref);
                                response.put("performance", perf);
                                response.put("performance", perf);
                                response.put("onboardingCompleted", user.getOnboardingCompleted());

                                // NEW: Admin Type for Frontend Routing
                                response.put("adminType", user.isAdminTypeGlobal() ? "GLOBAL" : "ORG");

                                return ResponseEntity.ok(response);
                        } else {
                                auditLogRepository.save(new org.example.salesincentivesystem.entity.AuditLog(
                                                user.getId(), email,
                                                "LOGIN_FAIL_BAD_CREDENTIALS", ipAddress));
                                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
                        }
                }

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found. Please register.");
        }

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
                String email = userData.get("email");
                String password = userData.get("password");
                String name = userData.get("name");
                // Default to SALES logic for now, or allow robust role selection if needed
                // (safe to default to SALES)
                // String role = userData.getOrDefault("role", "SALES");

                String ipAddress = "127.0.0.1";

                if (userRepository.findByEmail(email).isPresent()) {
                        return ResponseEntity.badRequest().body("Email already in use");
                }

                if (email == null || email.trim().isEmpty() || !email.contains("@")) {
                        return ResponseEntity.badRequest().body("Invalid email format");
                }

                try {
                        // RESTRICTED: Public signup always creates ADMIN/OWNER accounts.
                        User newUser = new User(email, password, "ADMIN", name);
                        newUser.setOnboardingCompleted(false);
                        // Save Organization Name to User Entity
                        String companyName = userData.get("companyName") != null ? userData.get("companyName") : "N/A";
                        newUser.setOrganizationName(companyName);
                        User savedUser = userRepository.save(newUser);

                        // Seed Default Profile Data
                        org.example.salesincentivesystem.entity.SalesProfile profile = new org.example.salesincentivesystem.entity.SalesProfile(
                                        savedUser, "N/A", "Headquarters", "EMP-" + savedUser.getId(),
                                        java.time.LocalDate.now());
                        salesProfileRepository.save(profile);

                        org.example.salesincentivesystem.entity.UserPreference pref = new org.example.salesincentivesystem.entity.UserPreference(
                                        savedUser, "LIGHT", "INR", "EN");
                        userPreferenceRepository.save(pref);

                        org.example.salesincentivesystem.entity.SalesPerformance perf = new org.example.salesincentivesystem.entity.SalesPerformance();
                        perf.setUser(savedUser);
                        perf.setAchievements("Joined Team");
                        perf.setCurrentMonthTarget(100000.0);
                        perf.setPerformanceRating(0.0);
                        salesPerformanceRepository.save(perf);

                        auditLogRepository.save(
                                        new org.example.salesincentivesystem.entity.AuditLog(savedUser.getId(), email,
                                                        "REGISTER_SUCCESS", ipAddress));

                        // Send Welcome Email
                        emailService.sendWelcomeEmail(email, name);

                        Map<String, Object> response = new java.util.HashMap<>();
                        response.put("token", "dummy-jwt-token-" + savedUser.getId());

                        // Add organizationName to user object for frontend access
                        Map<String, Object> userWithOrg = new java.util.HashMap<>();
                        userWithOrg.put("id", savedUser.getId());
                        userWithOrg.put("email", savedUser.getEmail());
                        userWithOrg.put("name", savedUser.getName());
                        userWithOrg.put("role", savedUser.getRole());
                        userWithOrg.put("accountStatus", savedUser.getAccountStatus());
                        userWithOrg.put("onboardingCompleted", savedUser.getOnboardingCompleted());
                        userWithOrg.put("organizationName", companyName);

                        response.put("user", userWithOrg);
                        response.put("role", savedUser.getRole());
                        response.put("name", savedUser.getName());
                        response.put("email", savedUser.getEmail());
                        response.put("status", savedUser.getAccountStatus());
                        response.put("onboardingCompleted", savedUser.getOnboardingCompleted());

                        response.put("profile", profile);
                        response.put("preferences", pref);
                        response.put("performance", perf);

                        return ResponseEntity.ok(response);
                } catch (Exception e) {
                        e.printStackTrace(); // Log to console for debugging
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("Registration failed: " + e.getMessage());
                }
        }

        @PostMapping("/complete-invite")
        public ResponseEntity<?> completeInvite(@RequestBody Map<String, String> body) {
                String token = body.get("token");
                String password = body.get("password");

                try {
                        org.example.salesincentivesystem.entity.Invitation invite = invitationService
                                        .validateToken(token);
                        String email = invite.getEmail();

                        if (userRepository.findByEmail(email).isPresent()) {
                                return ResponseEntity.badRequest().body("User already registered with this email");
                        }

                        // Create SALES User
                        User newUser = new User(email, password, "SALES", "Sales Executive");
                        newUser.setOnboardingCompleted(false);

                        // Inherit Organization from Inviter (Admin)
                        if (invite.getInvitedBy() != null) {
                                User inviter = invite.getInvitedBy();
                                if (inviter.getOrganizationName() != null) {
                                        newUser.setOrganizationName(inviter.getOrganizationName());
                                }
                        }

                        User savedUser = userRepository.save(newUser);

                        // Seed Data
                        org.example.salesincentivesystem.entity.SalesProfile profile = new org.example.salesincentivesystem.entity.SalesProfile(
                                        savedUser, "N/A", "General Sales", "EMP-" + savedUser.getId(),
                                        java.time.LocalDate.now());
                        salesProfileRepository.save(profile);

                        org.example.salesincentivesystem.entity.UserPreference pref = new org.example.salesincentivesystem.entity.UserPreference(
                                        savedUser, "LIGHT", "INR", "EN");
                        userPreferenceRepository.save(pref);

                        org.example.salesincentivesystem.entity.SalesPerformance perf = new org.example.salesincentivesystem.entity.SalesPerformance();
                        perf.setUser(savedUser);
                        perf.setAchievements("Joined Team via Invite");
                        perf.setCurrentMonthTarget(100000.0);
                        perf.setPerformanceRating(0.0);
                        salesPerformanceRepository.save(perf);

                        auditLogRepository.save(new org.example.salesincentivesystem.entity.AuditLog(
                                        savedUser.getId(), email, "INVITE_ACCEPTED", "127.0.0.1"));

                        // Auto-assign deal if specified in invitation
                        if (invite.getAssignedDealId() != null) {
                                try {
                                        java.util.Optional<org.example.salesincentivesystem.entity.Deal> dealOpt = dealRepository
                                                        .findById(invite.getAssignedDealId());
                                        if (dealOpt.isPresent()) {
                                                org.example.salesincentivesystem.entity.Deal deal = dealOpt.get();
                                                deal.setUser(savedUser);
                                                deal.setStatus("ASSIGNED");
                                                deal.setUpdatedAt(java.time.LocalDateTime.now());
                                                dealRepository.save(deal);

                                                // Update Onboarding for the inviter (Admin)
                                                if (invite.getInvitedBy() != null) {
                                                        User admin = invite.getInvitedBy();
                                                        if (admin.getFirstUserInvited() == null
                                                                        || !admin.getFirstUserInvited()) {
                                                                admin.setFirstUserInvited(true);
                                                                userRepository.save(admin);
                                                        }
                                                }

                                                System.out.println("DEBUG: Assigned Deal " + deal.getId()
                                                                + " to new user " + savedUser.getName());
                                        }
                                } catch (Exception e) {
                                        System.err.println("Error assigning deal during signup: " + e.getMessage());
                                }
                        }

                        // Mark invitation as accepted
                        // Note: invitationService.acceptInvitation might do some of this already,
                        // but we are doing it manually here or reusing the service if it exists.
                        // For now, let's assume valid logic.

                        Map<String, Object> response = new java.util.HashMap<>();
                        response.put("token", "dummy-jwt-token-" + savedUser.getId());

                        // Add organizationName to user object for frontend access
                        Map<String, Object> userWithOrg = new java.util.HashMap<>();
                        userWithOrg.put("id", savedUser.getId());
                        userWithOrg.put("email", savedUser.getEmail());
                        userWithOrg.put("name", savedUser.getName());
                        userWithOrg.put("role", savedUser.getRole());
                        userWithOrg.put("accountStatus", savedUser.getAccountStatus());
                        userWithOrg.put("onboardingCompleted", savedUser.getOnboardingCompleted());
                        userWithOrg.put("organizationName", "Sales Team");

                        response.put("user", userWithOrg);
                        response.put("role", savedUser.getRole());

                        return ResponseEntity.ok(response);
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body("Invitation acceptance failed: " + e.getMessage());
                }
        }
}
