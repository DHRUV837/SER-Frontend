package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.RuleConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RuleConfigRepository extends JpaRepository<RuleConfig, Long> {
    List<RuleConfig> findByActiveTrue();
}
