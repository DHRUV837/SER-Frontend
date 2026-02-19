package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final DealRepository dealRepository;

    public SimulationController(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    @PostMapping("/preview")
    public SimulationResult previewPolicy(@RequestBody SimulationRequest request) {
        List<Deal> allDeals = dealRepository.findAll();

        double currentTotalPayout = allDeals.stream()
                .filter(d -> "Approved".equalsIgnoreCase(d.getStatus()))
                .mapToDouble(Deal::getIncentive)
                .sum();

        double projectedTotalPayout = 0;
        int impactedDeals = 0;

        for (Deal deal : allDeals) {
            if (!"Approved".equalsIgnoreCase(deal.getStatus()))
                continue;

            double originalIncentive = deal.getIncentive();
            double newIncentive = 0;

            // Simulation Logic (Mirrors DealController logic but with dynamic params)
            if (deal.getAmount() <= request.getThreshold()) {
                newIncentive = deal.getAmount() * (request.getLowRate() / 100.0);
            } else {
                newIncentive = deal.getAmount() * (request.getHighRate() / 100.0);
            }

            projectedTotalPayout += newIncentive;

            if (Math.abs(newIncentive - originalIncentive) > 0.01) {
                impactedDeals++;
            }
        }

        return new SimulationResult(
                currentTotalPayout,
                projectedTotalPayout,
                projectedTotalPayout - currentTotalPayout,
                impactedDeals);
    }

    // Inner DTOs
    public static class SimulationRequest {
        private Double threshold;
        private Double lowRate;
        private Double highRate;

        public Double getThreshold() {
            return threshold;
        }

        public void setThreshold(Double threshold) {
            this.threshold = threshold;
        }

        public Double getLowRate() {
            return lowRate;
        }

        public void setLowRate(Double lowRate) {
            this.lowRate = lowRate;
        }

        public Double getHighRate() {
            return highRate;
        }

        public void setHighRate(Double highRate) {
            this.highRate = highRate;
        }
    }

    public static class SimulationResult {
        private Double currentPayout;
        private Double projectedPayout;
        private Double difference;
        private Integer impactedDealsCount;

        public SimulationResult(Double currentPayout, Double projectedPayout, Double difference,
                Integer impactedDealsCount) {
            this.currentPayout = currentPayout;
            this.projectedPayout = projectedPayout;
            this.difference = difference;
            this.impactedDealsCount = impactedDealsCount;
        }

        // Getters
        public Double getCurrentPayout() {
            return currentPayout;
        }

        public Double getProjectedPayout() {
            return projectedPayout;
        }

        public Double getDifference() {
            return difference;
        }

        public Integer getImpactedDealsCount() {
            return impactedDealsCount;
        }
    }
}
