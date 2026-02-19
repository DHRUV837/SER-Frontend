package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.RuleConfig;
import org.example.salesincentivesystem.repository.RuleConfigRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rules")
public class RuleController {

    private final RuleConfigRepository ruleRepository;

    public RuleController(RuleConfigRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    @GetMapping
    public List<RuleConfig> getAllRules() {
        List<RuleConfig> rules = ruleRepository.findAll();
        if (rules.isEmpty()) {
            createDefaultRule("Big Deal Alert", "DEAL_AMOUNT", "GT", 100000, "NOTIFY_ADMIN");
            createDefaultRule("High Discount Warning", "DISCOUNT_RATE", "GT", 15, "FLAG_RISK");
            return ruleRepository.findAll();
        }
        return rules;
    }

    private void createDefaultRule(String name, String metric, String op, double val, String action) {
        RuleConfig r = new RuleConfig();
        r.setName(name);
        r.setMetric(metric);
        r.setOperator(op);
        r.setThreshold(val);
        r.setAction(action);
        ruleRepository.save(r);
    }

    @PostMapping
    public RuleConfig saveRule(@RequestBody RuleConfig rule) {
        return ruleRepository.save(rule);
    }

    @DeleteMapping("/{id}")
    public void deleteRule(@PathVariable Long id) {
        ruleRepository.deleteById(id);
    }
}
