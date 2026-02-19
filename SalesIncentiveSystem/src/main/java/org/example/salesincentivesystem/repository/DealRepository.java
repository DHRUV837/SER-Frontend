package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DealRepository extends JpaRepository<Deal, Long> {
    long countByUserId(Long userId);

    java.util.List<Deal> findByUser_OrganizationName(String organizationName);
}
