package org.example.salesincentivesystem.service;

import org.example.salesincentivesystem.entity.AuditLog;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(User actor, String action, String entityType, Long entityId, String details) {
        AuditLog log = new AuditLog(
                actor != null ? actor.getId() : null,
                actor != null ? actor.getEmail() : "SYSTEM",
                action,
                entityType,
                entityId,
                details);
        auditLogRepository.save(log);
    }

    // Overload for system actions or when User object isn't fully available but
    // ID/Email is known
    public void logAction(Long userId, String email, String action, String entityType, Long entityId, String details) {
        AuditLog log = new AuditLog(userId, email, action, entityType, entityId, details);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll(org.springframework.data.domain.Sort
                .by(org.springframework.data.domain.Sort.Direction.DESC, "timestamp"));
    }

    public List<AuditLog> searchLogs(String action, String email, LocalDateTime start, LocalDateTime end) {
        return auditLogRepository.searchLogs(action, email, start, end);
    }
}
