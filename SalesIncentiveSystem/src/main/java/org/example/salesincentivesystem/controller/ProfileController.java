package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.UserRepository;
import org.example.salesincentivesystem.repository.SalesProfileRepository;
import org.example.salesincentivesystem.repository.DealRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final SalesProfileRepository salesProfileRepository;
    private final DealRepository dealRepository;
    private final org.example.salesincentivesystem.repository.UserPreferenceRepository userPreferenceRepository;
    private final org.example.salesincentivesystem.repository.SalesPerformanceRepository salesPerformanceRepository;

    public ProfileController(UserRepository userRepository,
            SalesProfileRepository salesProfileRepository,
            DealRepository dealRepository,
            org.example.salesincentivesystem.repository.UserPreferenceRepository userPreferenceRepository,
            org.example.salesincentivesystem.repository.SalesPerformanceRepository salesPerformanceRepository) {
        this.userRepository = userRepository;
        this.salesProfileRepository = salesProfileRepository;
        this.dealRepository = dealRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.salesPerformanceRepository = salesPerformanceRepository;
    }

    @GetMapping("/me")
    public Map<String, Object> getMyProfile(@RequestParam Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, Object> response = new HashMap<>();

        // 1. Basic User Info
        response.put("user", user);

        // 2. Sales Profile (Lazy Init)
        org.example.salesincentivesystem.entity.SalesProfile profile = salesProfileRepository.findAll().stream()
                .filter(p -> p.getUser().getId().equals(userId))
                .findFirst()
                .orElseGet(() -> {
                    if ("SALES".equals(user.getRole())) {
                        org.example.salesincentivesystem.entity.SalesProfile newProfile = new org.example.salesincentivesystem.entity.SalesProfile(
                                user, "N/A", "General Sales", "EMP-" + user.getId(), java.time.LocalDate.now());
                        return salesProfileRepository.save(newProfile);
                    }
                    return null;
                });
        response.put("salesProfile", profile);

        // 3. User Preferences (Lazy Init)
        org.example.salesincentivesystem.entity.UserPreference pref = userPreferenceRepository.findAll().stream() // Ideally
                                                                                                                  // findByUserId
                .filter(p -> p.getUser().getId().equals(userId))
                .findFirst()
                .orElseGet(() -> {
                    org.example.salesincentivesystem.entity.UserPreference newPref = new org.example.salesincentivesystem.entity.UserPreference(
                            user, "LIGHT", "INR", "EN");
                    return userPreferenceRepository.save(newPref);
                });
        // We aren't returning preferences in main map yet, but good to ensure it exists
        // for other endpoints

        // 4. Performance (Lazy Init)
        if ("SALES".equals(user.getRole())) {
            salesPerformanceRepository.findAll().stream()
                    .filter(p -> p.getUser().getId().equals(userId))
                    .findFirst()
                    .orElseGet(() -> {
                        org.example.salesincentivesystem.entity.SalesPerformance newPerf = new org.example.salesincentivesystem.entity.SalesPerformance();
                        newPerf.setUser(user);
                        newPerf.setAchievements("Joined Team");
                        newPerf.setCurrentMonthTarget(100000.0);
                        newPerf.setPerformanceRating(0.0);
                        return salesPerformanceRepository.save(newPerf);
                    });

            var deals = dealRepository.findAll().stream()
                    .filter(d -> d.getUser() != null && d.getUser().getId().equals(userId))
                    .collect(Collectors.toList());

            response.put("totalDeals", deals.size());
            response.put("approvedDeals", deals.stream().filter(d -> "Approved".equals(d.getStatus())).count());
            response.put("totalIncentive", deals.stream()
                    .filter(d -> "Approved".equals(d.getStatus()))
                    .mapToDouble(org.example.salesincentivesystem.entity.Deal::getIncentive)
                    .sum());
        }

        // 4. Admin Stats (if Admin)
        if ("ADMIN".equals(user.getRole())) {
            long totalUsers = userRepository.count();
            long pendingDeals = dealRepository.findAll().stream().filter(d -> "Submitted".equals(d.getStatus()))
                    .count();

            response.put("systemStats", Map.of(
                    "totalUsers", totalUsers,
                    "pendingApprovals", pendingDeals));
        }

        return response;
    }
}
