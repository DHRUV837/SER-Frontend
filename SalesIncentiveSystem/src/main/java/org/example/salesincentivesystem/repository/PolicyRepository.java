package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByIsActiveTrue();

    List<Policy> findByType(String type);

    List<Policy> findByTypeAndIsActiveTrue(String type);
}
