package org.example.salesincentivesystem.service;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RiskAssessmentService {

    private final DealRepository dealRepository;

    public RiskAssessmentService(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    public String assessRisk(Deal deal) {
        // rule 1: High Value Deal
        if (deal.getAmount() > 500000) {
            return "HIGH";
        }

        // Rule 2: High Incentive Rate (> 20%)
        if (deal.getRate() > 20.0) {
            return "HIGH";
        }

        // Rule 3: Frequency Check (Too many deals today)
        /*
         * List<Deal> todayDeals = dealRepository.findByUserAndDate(deal.getUser(),
         * deal.getDate());
         * if (todayDeals.size() > 5) {
         * return "MEDIUM";
         * }
         */

        if (deal.getAmount() > 200000) {
            return "MEDIUM";
        }

        return "LOW";
    }
}
