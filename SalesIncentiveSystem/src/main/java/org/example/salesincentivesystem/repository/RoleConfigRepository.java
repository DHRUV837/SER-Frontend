package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.RoleConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleConfigRepository extends JpaRepository<RoleConfig, Long> {
    Optional<RoleConfig> findByRoleName(String roleName);
}
