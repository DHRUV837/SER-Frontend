package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.IncentivePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncentivePolicyRepository extends JpaRepository<IncentivePolicy, Long> {
    List<IncentivePolicy> findAllByOrderByDisplayOrderAsc();
}
