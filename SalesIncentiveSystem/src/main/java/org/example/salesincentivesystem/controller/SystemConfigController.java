package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.SystemConfig;
import org.example.salesincentivesystem.repository.SystemConfigRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/settings")
public class SystemConfigController {

    private final SystemConfigRepository configRepository;

    public SystemConfigController(SystemConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    @PostConstruct
    public void seedDefaults() {
        if (configRepository.count() == 0) {
            configRepository.save(new SystemConfig("currency_symbol", "₹", "Currency symbol used across the app"));
            configRepository.save(new SystemConfig("maintenance_mode", "false", "If true, disables non-admin access"));
            configRepository.save(new SystemConfig("default_commission", "5.0", "Default commission rate (%)"));
            configRepository.save(new SystemConfig("max_incentive_cap", "500000", "Maximum incentive per deal (₹)"));
        }
    }

    @GetMapping
    public List<SystemConfig> getAllSettings() {
        return configRepository.findAll();
    }

    @PostMapping
    public SystemConfig updateSetting(@RequestBody SystemConfig config) {
        return configRepository.save(config);
    }

    // Bulk update endpoint
    @PostMapping("/bulk")
    public List<SystemConfig> updateSettings(@RequestBody List<SystemConfig> configs) {
        return configRepository.saveAll(configs);
    }
}
