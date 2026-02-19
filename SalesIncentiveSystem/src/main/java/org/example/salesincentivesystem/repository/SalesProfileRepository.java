package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.SalesProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesProfileRepository extends JpaRepository<SalesProfile, Long> {
    java.util.Optional<SalesProfile> findByUserId(Long userId);
}
