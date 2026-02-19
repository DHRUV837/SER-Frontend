package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    java.util.Optional<UserPreference> findByUserId(Long userId);
}
