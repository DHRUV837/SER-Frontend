package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingProgressController {

    private final UserRepository userRepository;

    public OnboardingProgressController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/progress/{userId}")
    public ResponseEntity<Map<String, Object>> getProgress(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> progress = new HashMap<>();
        progress.put("firstTargetCreated", user.getFirstTargetCreated() != null ? user.getFirstTargetCreated() : false);
        progress.put("firstDealCreated", user.getFirstDealCreated() != null ? user.getFirstDealCreated() : false);
        progress.put("firstRuleConfigured",
                user.getFirstRuleConfigured() != null ? user.getFirstRuleConfigured() : false);
        progress.put("firstUserInvited", user.getFirstUserInvited() != null ? user.getFirstUserInvited() : false);
        progress.put("onboardingCompleted",
                user.getOnboardingCompleted() != null ? user.getOnboardingCompleted() : false);

        // Calculate completion percentage
        int completed = 0;
        if (user.getFirstTargetCreated() != null && user.getFirstTargetCreated())
            completed++;
        if (user.getFirstDealCreated() != null && user.getFirstDealCreated())
            completed++;
        if (user.getFirstRuleConfigured() != null && user.getFirstRuleConfigured())
            completed++;
        if (user.getFirstUserInvited() != null && user.getFirstUserInvited())
            completed++;

        progress.put("completionPercentage", (completed * 100) / 4);
        progress.put("completedCount", completed);
        progress.put("totalCount", 4);

        return ResponseEntity.ok(progress);
    }

    @PostMapping("/progress/update")
    public ResponseEntity<Map<String, Object>> updateProgress(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String task = request.get("task").toString();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update the specific task
        switch (task) {
            case "firstTarget":
                user.setFirstTargetCreated(true);
                break;
            case "firstDeal":
                user.setFirstDealCreated(true);
                break;
            case "firstRule":
                user.setFirstRuleConfigured(true);
                break;
            case "firstInvite":
                user.setFirstUserInvited(true);
                break;
            default:
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid task"));
        }

        // Check if all tasks are complete
        boolean allComplete = (user.getFirstTargetCreated() != null && user.getFirstTargetCreated()) &&
                (user.getFirstDealCreated() != null && user.getFirstDealCreated()) &&
                (user.getFirstRuleConfigured() != null && user.getFirstRuleConfigured()) &&
                (user.getFirstUserInvited() != null && user.getFirstUserInvited());

        if (allComplete && (user.getOnboardingCompleted() == null || !user.getOnboardingCompleted())) {
            user.setOnboardingCompleted(true);
        }

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("task", task);
        response.put("allComplete", allComplete);
        response.put("onboardingCompleted", user.getOnboardingCompleted());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/complete/{userId}")
    public ResponseEntity<Map<String, Object>> completeOnboarding(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setOnboardingCompleted(true);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("success", true, "onboardingCompleted", true));
    }
}
