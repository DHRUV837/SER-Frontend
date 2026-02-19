package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.dto.PerformanceSummary;
import org.example.salesincentivesystem.service.PerformanceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/performance")
public class PerformanceController {

    private final PerformanceService performanceService;

    public PerformanceController(PerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    @GetMapping("/{userId}")
    public PerformanceSummary getPerformance(@PathVariable Long userId) {
        return performanceService.getPerformanceSummary(userId);
    }
}
