package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser_IdOrderByTimestampDesc(Long userId);

    void deleteByUserId(Long userId);

    List<Notification> findByUser_Id(Long userId);
}
