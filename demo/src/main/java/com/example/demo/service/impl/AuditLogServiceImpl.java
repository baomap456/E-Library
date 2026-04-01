package com.example.demo.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.AuditLog;
import com.example.demo.repository.AuditLogRepository;
import com.example.demo.service.AuditLogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public void log(String actor, String action, String targetType, String targetId, String details) {
        AuditLog entry = new AuditLog();
        entry.setActor(actor == null || actor.isBlank() ? "SYSTEM" : actor);
        entry.setAction(action);
        entry.setTargetType(targetType);
        entry.setTargetId(targetId);
        entry.setDetails(details);
        auditLogRepository.save(entry);
    }

    @Override
    public List<AuditLog> latest() {
        return auditLogRepository.findTop200ByOrderByCreatedAtDesc();
    }
}
