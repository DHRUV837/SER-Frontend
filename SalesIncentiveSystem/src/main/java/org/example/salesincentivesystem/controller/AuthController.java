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

        public AuthController(UserRepository userRepository,
                        org.example.salesincentivesystem.repository.AuditLogRepository auditLogRepository,
                        org.example.salesincentivesystem.repository.SalesProfileRepository salesProfileRepository,
                        org.example.salesincentivesystem.repository.UserPreferenceRepository userPreferenceRepository,
                        org.example.salesincentivesystem.repository.SalesPerformanceRepository salesPerformanceRepository) {
                this.userRepository = userRepository;
                this.auditLogRepository = auditLogRepository;
                this.salesProfileRepository = salesProfileRepository;
                this.userPreferenceRepository = userPreferenceRepository;
                this.salesPerformanceRepository = salesPerformanceRepository;
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
                                                .findAll()
                                                .stream()
                                                .filter(p -> p.getUser().getId().equals(user.getId())).findFirst()
                                                .orElse(null);

                                org.example.salesincentivesystem.entity.SalesProfile userProfile = salesProfileRepository
                                                .findAll()
                                                .stream()
                                                .filter(p -> p.getUser().getId().equals(user.getId())).findFirst()
                                                .orElse(null);

                                org.example.salesincentivesystem.entity.SalesPerformance perf = salesPerformanceRepository
                                                .findAll()
                                                .stream()
                                                .filter(p -> p.getUser().getId().equals(user.getId())).findFirst()
                                                .orElse(null);

                                Map<String, Object> response = new java.util.HashMap<>();
                                response.put("token", "dummy-jwt-token-" + user.getId());
                                response.put("user", user);
                                // Restore top-level fields for Frontend compatibility
                                response.put("role", user.getRole());
                                response.put("name", user.getName());
                                response.put("email", user.getEmail());
                                response.put("status", user.getAccountStatus());

                                response.put("profile", userProfile);
                                response.put("preferences", pref);
                                response.put("performance", perf);

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

                User newUser = new User(email, password, "SALES", name);
                User savedUser = userRepository.save(newUser);

                // Seed Default Profile Data
                org.example.salesincentivesystem.entity.SalesProfile profile = new org.example.salesincentivesystem.entity.SalesProfile(
                                savedUser, "N/A", "General Sales", "EMP-" + savedUser.getId(),
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

                Map<String, Object> response = new java.util.HashMap<>();
                response.put("token", "dummy-jwt-token-" + savedUser.getId());
                response.put("user", savedUser);
                response.put("role", savedUser.getRole());

                return ResponseEntity.ok(response);
        }
}
