package com.example.demo.service;

import java.util.List;

import com.example.demo.model.AuditLog;

public interface AuditLogService {
    void log(String actor, String action, String targetType, String targetId, String details);

    List<AuditLog> latest();
}
