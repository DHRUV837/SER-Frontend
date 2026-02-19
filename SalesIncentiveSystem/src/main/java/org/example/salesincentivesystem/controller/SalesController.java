package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    private final DealRepository dealRepository;

    public SalesController(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    @GetMapping("/my-deals/{userId}")
    public ResponseEntity<List<Deal>> getMyDeals(@PathVariable Long userId) {
        List<Deal> deals = dealRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(userId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/payouts/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getPayouts(@PathVariable Long userId) {
        // Mock Payouts for now based on approved deals
        List<Deal> approvedDeals = dealRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(userId)
                        && "Approved".equalsIgnoreCase(d.getStatus()))
                .collect(Collectors.toList());

        List<Map<String, Object>> payouts = approvedDeals.stream().map(d -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("dealId", d.getId());
            map.put("amount", d.getIncentive());
            map.put("date",
                    d.getActualCloseDate() != null ? d.getActualCloseDate().toString() : d.getDate().toString());
            map.put("status", "Processed");
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(payouts);
    }
}
