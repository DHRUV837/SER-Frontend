package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.SalesPerformance;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.SalesPerformanceRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/performance")
public class SalesPerformanceController {

    private final SalesPerformanceRepository performanceRepository;
    private final UserRepository userRepository;
    private final org.example.salesincentivesystem.service.PerformanceService performanceService;

    public SalesPerformanceController(SalesPerformanceRepository performanceRepository, UserRepository userRepository,
            org.example.salesincentivesystem.service.PerformanceService performanceService) {
        this.performanceRepository = performanceRepository;
        this.userRepository = userRepository;
        this.performanceService = performanceService;
    }

    @GetMapping("/summary")
    public ResponseEntity<org.example.salesincentivesystem.dto.PerformanceSummary> getPerformanceSummary(
            @RequestParam Long userId) {
        return ResponseEntity.ok(performanceService.getPerformanceSummary(userId));
    }

    @GetMapping
    public ResponseEntity<SalesPerformance> getPerformance(@RequestParam Long userId) {
        return performanceRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    // Create default if not exists
                    User user = userRepository.findById(userId).orElse(null);
                    if (user == null)
                        return ResponseEntity.notFound().build();

                    SalesPerformance defaultPerf = new SalesPerformance(user, 100000.0, 0.0, "");
                    try {
                        return ResponseEntity.ok(performanceRepository.save(defaultPerf));
                    } catch (Exception e) {
                        return ResponseEntity.internalServerError().build();
                    }
                });
    }

    @PutMapping("/target")
    public ResponseEntity<?> updateTarget(@RequestBody Map<String, Object> payload) {
        Long userId = ((Number) payload.get("userId")).longValue();
        Double target = ((Number) payload.get("target")).doubleValue();

        return performanceRepository.findByUserId(userId)
                .map(perf -> {
                    perf.setCurrentMonthTarget(target);
                    performanceRepository.save(perf);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElse(null);
                    if (user == null)
                        return ResponseEntity.notFound().build();

                    SalesPerformance newPerf = new SalesPerformance(user, target, 0.0, "");
                    performanceRepository.save(newPerf);
                    return ResponseEntity.ok().build();
                });
    }
}
