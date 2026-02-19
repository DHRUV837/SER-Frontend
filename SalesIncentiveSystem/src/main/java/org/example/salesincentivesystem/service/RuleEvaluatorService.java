package org.example.salesincentivesystem.service;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.entity.Notification;
import org.example.salesincentivesystem.entity.RuleConfig;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.NotificationRepository;
import org.example.salesincentivesystem.repository.RuleConfigRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RuleEvaluatorService {

    private final RuleConfigRepository ruleRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public RuleEvaluatorService(RuleConfigRepository ruleRepository,
            NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.ruleRepository = ruleRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public void evaluate(Deal deal) {
        List<RuleConfig> activeRules = ruleRepository.findByActiveTrue();
        List<User> admins = userRepository.findByRole("ADMIN");

        for (RuleConfig rule : activeRules) {
            boolean triggered = checkCondition(deal, rule);
            if (triggered) {
                // Send alert to all admins
                for (User admin : admins) {
                    Notification n = new Notification(
                            admin,
                            "warning",
                            "Rule Triggered: " + rule.getName(),
                            "Deal #" + deal.getId() + " by " + deal.getUser().getName() + " matched rule: "
                                    + rule.getMetric() + " " + rule.getOperator() + " " + rule.getThreshold());
                    notificationRepository.save(n);
                }
            }
        }
    }

    private boolean checkCondition(Deal deal, RuleConfig rule) {
        double value = 0.0;

        switch (rule.getMetric()) {
            case "DEAL_AMOUNT":
                value = deal.getAmount();
                break;
            // Add more metrics here when available (e.g. discount)
            default:
                return false;
        }

        switch (rule.getOperator()) {
            case "GT":
                return value > rule.getThreshold();
            case "LT":
                return value < rule.getThreshold();
            default:
                return false;
        }
    }
}
