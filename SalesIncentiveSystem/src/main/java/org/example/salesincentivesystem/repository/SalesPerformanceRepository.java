package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.SalesPerformance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesPerformanceRepository extends JpaRepository<SalesPerformance, Long> {
    java.util.Optional<SalesPerformance> findByUserId(Long userId);
}
