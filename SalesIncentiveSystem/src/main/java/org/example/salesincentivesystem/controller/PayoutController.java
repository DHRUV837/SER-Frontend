package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/payouts")
public class PayoutController {

    private final DealRepository dealRepository;

    public PayoutController(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    // GET /payouts?status=PENDING
    @GetMapping
    public List<Deal> getPayouts(@RequestParam(required = false, defaultValue = "PENDING") String status) {
        return dealRepository.findAll().stream()
                .filter(d -> "Approved".equalsIgnoreCase(d.getStatus())) // Only approved deals are payable
                .filter(d -> {
                    String pStatus = d.getPayoutStatus() == null ? "PENDING" : d.getPayoutStatus();
                    return status.equalsIgnoreCase(pStatus);
                })
                .collect(Collectors.toList());
    }

    // POST /payouts/mark-paid
    @PostMapping("/mark-paid")
    public List<Deal> markAsPaid(@RequestBody List<Long> dealIds) {
        List<Deal> deals = dealRepository.findAllById(dealIds);
        java.time.LocalDate today = java.time.LocalDate.now();

        deals.forEach(d -> {
            d.setPayoutStatus("PAID");
            d.setPayoutDate(today);
        });

        return dealRepository.saveAll(deals);
    }

    // GET /payouts/summary
    @GetMapping("/summary")
    public Map<String, Object> getPayoutSummary() {
        List<Deal> approved = dealRepository.findAll().stream()
                .filter(d -> "Approved".equalsIgnoreCase(d.getStatus()))
                .collect(Collectors.toList());

        double totalPending = approved.stream()
                .filter(d -> {
                    String s = d.getPayoutStatus() == null ? "PENDING" : d.getPayoutStatus();
                    return "PENDING".equalsIgnoreCase(s);
                })
                .mapToDouble(Deal::getIncentive)
                .sum();

        double totalPaid = approved.stream()
                .filter(d -> "PAID".equalsIgnoreCase(d.getPayoutStatus()))
                .mapToDouble(Deal::getIncentive)
                .sum();

        long pendingCount = approved.stream()
                .filter(d -> {
                    String s = d.getPayoutStatus() == null ? "PENDING" : d.getPayoutStatus();
                    return "PENDING".equalsIgnoreCase(s);
                }).count();

        return Map.of(
                "totalPending", totalPending,
                "totalPaid", totalPaid,
                "pendingCount", pendingCount,
                "paidCount", approved.stream().filter(d -> "PAID".equalsIgnoreCase(d.getPayoutStatus())).count());
    }
}
