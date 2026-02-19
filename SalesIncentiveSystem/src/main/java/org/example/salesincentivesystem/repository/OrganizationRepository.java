package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByAdminUserId(Long adminUserId);
}
