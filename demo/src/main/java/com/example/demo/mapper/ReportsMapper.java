package com.example.demo.mapper;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.demo.dto.reports.ReportsDiscrepancyResponse;
import com.example.demo.dto.reports.ReportsInventorySessionResponse;

@Component
public class ReportsMapper {

    public ReportsDiscrepancyResponse toDiscrepancyResponse(String title, long systemCount) {
        return new ReportsDiscrepancyResponse(
                title,
                systemCount,
                Math.max(0, systemCount - 1),
                -1);
    }

    public ReportsInventorySessionResponse toInventorySessionResponse(Map<String, Object> map) {
        Long id = map.get("id") instanceof Number number ? number.longValue() : null;
        LocalDateTime createdAt = map.get("createdAt") instanceof LocalDateTime dateTime ? dateTime : null;

        return new ReportsInventorySessionResponse(
                id,
                String.valueOf(map.getOrDefault("name", "")),
                String.valueOf(map.getOrDefault("area", "")),
                String.valueOf(map.getOrDefault("status", "OPEN")),
                createdAt);
    }
}
