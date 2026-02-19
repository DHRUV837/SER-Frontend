package org.example.salesincentivesystem.service;

import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.AuditLogRepository;
import org.example.salesincentivesystem.repository.DealRepository;
import org.example.salesincentivesystem.repository.PolicyRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.example.salesincentivesystem.dto.ProfileRequest;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class OnboardingService {

    private final UserRepository userRepository;
    private final DealRepository dealRepository;
    private final PolicyRepository policyRepository;
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper(); // Reuse mapper

    public OnboardingService(UserRepository userRepository, DealRepository dealRepository,
            PolicyRepository policyRepository, AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.dealRepository = dealRepository;
        this.policyRepository = policyRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public Map<String, Object> getOnboardingStatus(User user) {
        Map<String, Object> status = new HashMap<>();
        status.put("onboardingCompleted", user.getOnboardingCompleted());
        status.put("role", user.getRole());

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            status.put("hasCreatedPolicy", policyRepository.count() > 0);
            status.put("hasAddedUser", userRepository.count() > 1);
            status.put("hasViewedReport", auditLogRepository.existsByUserIdAndAction(user.getId(), "VIEW_REPORT"));
        } else {
            status.put("hasAddedDeal", dealRepository.countByUserId(user.getId()) > 0);
            status.put("hasViewedRankings", auditLogRepository.existsByUserIdAndAction(user.getId(), "VIEW_RANKINGS"));
        }

        return status;
    }

    public void completeOnboarding(User user) {
        user.setOnboardingCompleted(true);
        userRepository.save(user);
    }

    public void saveProfile(User user, ProfileRequest request) {
        if (request.getFullName() != null)
            user.setName(request.getFullName());
        if (request.getMobile() != null)
            user.setMobile(request.getMobile());
        if (request.getProfilePhoto() != null)
            user.setProfilePhotoUrl(request.getProfilePhoto());

        if (request.getRole() != null)
            user.setJobTitle(request.getRole());
        if (request.getDepartment() != null)
            user.setDepartment(request.getDepartment());
        if (request.getOrgName() != null)
            user.setOrganizationName(request.getOrgName());
        if (request.getBranch() != null)
            user.setBranch(request.getBranch());
        if (request.getManager() != null)
            user.setManagerName(request.getManager());

        if (request.getTerritory() != null)
            user.setTerritory(request.getTerritory());
        if (request.getProductCategory() != null)
            user.setProductCategory(request.getProductCategory());
        if (request.getExperienceLevel() != null)
            user.setExperienceLevel(request.getExperienceLevel());

        if (request.getIncentiveType() != null)
            user.setIncentiveType(request.getIncentiveType());

        if (request.getSecurity() != null) {
            user.setSecurity2FAEnabled(request.getSecurity().twoFA);
        }

        if (request.getLegal() != null) {
            user.setLegalAccepted(request.getLegal().terms && request.getLegal().privacy);
        }

        try {
            if (request.getNotifications() != null) {
                user.setNotificationsConfig(objectMapper.writeValueAsString(request.getNotifications()));
            }
        } catch (Exception e) {
            // Ignore for now
        }

        userRepository.save(user);
    }

    public Map<String, String> getRecommendedActions(User user) {
        Map<String, String> actions = new HashMap<>();
        if ("SALES".equalsIgnoreCase(user.getRole())) {
            if (dealRepository.countByUserId(user.getId()) == 0) {
                actions.put("primary", "Add your first sale to start tracking earnings!");
                actions.put("link", "/deals/create");
            } else {
                actions.put("primary", "Check your performance ranking.");
                actions.put("link", "/sales/leaderboard");
            }
        } else {
            if (policyRepository.count() == 0) {
                actions.put("primary", "Create an incentive policy to motivate your team.");
                actions.put("link", "/admin/policies");
            } else {
                actions.put("primary", "Invite more team members.");
                actions.put("link", "/admin/users");
            }
        }
        return actions;
    }
}
