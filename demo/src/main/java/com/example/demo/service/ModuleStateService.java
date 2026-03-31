package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class ModuleStateService {

    private final Map<Long, List<Long>> cartsByUser = new HashMap<>();
    private final Map<Long, List<Long>> waitlistsByBook = new HashMap<>();
    private final List<Map<String, Object>> incidentReports = new ArrayList<>();
    private final List<Map<String, Object>> inventorySessions = new ArrayList<>();

    public List<Long> getCart(Long userId) {
        return cartsByUser.computeIfAbsent(userId, id -> new ArrayList<>());
    }

    public void addToCart(Long userId, Long bookId) {
        List<Long> cart = getCart(userId);
        if (!cart.contains(bookId)) {
            cart.add(bookId);
        }
    }

    public void removeFromCart(Long userId, Long bookId) {
        getCart(userId).remove(bookId);
    }

    public void joinWaitlist(Long userId, Long bookId) {
        List<Long> queue = waitlistsByBook.computeIfAbsent(bookId, id -> new ArrayList<>());
        if (!queue.contains(userId)) {
            queue.add(userId);
        }
    }

    public int waitlistPosition(Long userId, Long bookId) {
        List<Long> queue = waitlistsByBook.getOrDefault(bookId, List.of());
        int index = queue.indexOf(userId);
        return index >= 0 ? index + 1 : 0;
    }

    public List<Long> getWaitlistBookIdsForUser(Long userId) {
        return waitlistsByBook.entrySet().stream()
                .filter(entry -> entry.getValue().contains(userId))
                .map(Map.Entry::getKey)
                .toList();
    }

    public Map<String, Object> addIncident(Map<String, Object> incident) {
        Map<String, Object> toSave = new HashMap<>(incident);
        toSave.put("id", (long) (incidentReports.size() + 1));
        toSave.put("createdAt", LocalDateTime.now());
        incidentReports.add(toSave);
        return toSave;
    }

    public List<Map<String, Object>> getIncidents() {
        return List.copyOf(incidentReports);
    }

    public Map<String, Object> addInventorySession(String name, String area) {
        Map<String, Object> session = new HashMap<>();
        session.put("id", (long) (inventorySessions.size() + 1));
        session.put("name", name);
        session.put("area", area);
        session.put("status", "OPEN");
        session.put("createdAt", LocalDateTime.now());
        inventorySessions.add(session);
        return session;
    }

    public List<Map<String, Object>> getInventorySessions() {
        return List.copyOf(inventorySessions);
    }
}
