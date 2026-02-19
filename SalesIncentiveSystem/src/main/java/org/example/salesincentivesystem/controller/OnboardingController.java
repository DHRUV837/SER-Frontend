package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.UserRepository;
import org.example.salesincentivesystem.service.OnboardingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private final OnboardingService onboardingService;
    private final UserRepository userRepository;
    private final org.example.salesincentivesystem.repository.SalesProfileRepository salesProfileRepository;
    private final org.example.salesincentivesystem.repository.UserPreferenceRepository userPreferenceRepository;
    private final org.example.salesincentivesystem.repository.SalesPerformanceRepository salesPerformanceRepository;

    public OnboardingController(OnboardingService onboardingService,
            UserRepository userRepository,
            org.example.salesincentivesystem.repository.SalesProfileRepository salesProfileRepository,
            org.example.salesincentivesystem.repository.UserPreferenceRepository userPreferenceRepository,
            org.example.salesincentivesystem.repository.SalesPerformanceRepository salesPerformanceRepository) {
        this.onboardingService = onboardingService;
        this.userRepository = userRepository;
        this.salesProfileRepository = salesProfileRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.salesPerformanceRepository = salesPerformanceRepository;
    }

    private User getAuthenticatedUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7); // Remove "Bearer "
        // Expected format: dummy-jwt-token-{userId}
        if (!token.startsWith("dummy-jwt-token-")) {
            throw new RuntimeException("Invalid token format");
        }

        try {
            String userIdStr = token.substring("dummy-jwt-token-".length());
            Long userId = Long.parseLong(userIdStr);
            return userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid user ID in token");
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus(HttpServletRequest request) {
        try {
            User user = getAuthenticatedUser(request);
            return ResponseEntity.ok(onboardingService.getOnboardingStatus(user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/complete")
    public ResponseEntity<Void> completeOnboarding(HttpServletRequest request) {
        try {
            User user = getAuthenticatedUser(request);
            onboardingService.completeOnboarding(user);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody org.example.salesincentivesystem.dto.ProfileRequest profileRequest,
            HttpServletRequest request) {
        try {
            User user = getAuthenticatedUser(request);
            onboardingService.saveProfile(user, profileRequest);

            // Mark onboarding as complete
            user.setOnboardingCompleted(true);
            User updatedUser = userRepository.save(user);

            // Fetch related data to return complete user state
            org.example.salesincentivesystem.entity.SalesProfile profile = salesProfileRepository
                    .findAll().stream()
                    .filter(p -> p.getUser().getId().equals(updatedUser.getId()))
                    .findFirst().orElse(null);

            org.example.salesincentivesystem.entity.UserPreference pref = userPreferenceRepository
                    .findAll().stream()
                    .filter(p -> p.getUser().getId().equals(updatedUser.getId()))
                    .findFirst().orElse(null);

            org.example.salesincentivesystem.entity.SalesPerformance perf = salesPerformanceRepository
                    .findAll().stream()
                    .filter(p -> p.getUser().getId().equals(updatedUser.getId()))
                    .findFirst().orElse(null);

            // Return complete user data structure matching login/register response
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("user", updatedUser);
            response.put("profile", profile);
            response.put("preferences", pref);
            response.put("performance", perf);
            response.put("onboardingCompleted", updatedUser.getOnboardingCompleted());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("System error: " + e.getMessage());
        }
    }

    @GetMapping("/nudge")
    public ResponseEntity<Map<String, String>> getNudge(HttpServletRequest request) {
        try {
            User user = getAuthenticatedUser(request);
            return ResponseEntity.ok(onboardingService.getRecommendedActions(user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build(); // Return 401 instead of body for simplicity in frontend handling
        }
    }
}
