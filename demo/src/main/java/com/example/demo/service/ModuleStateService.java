package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class ModuleStateService {

    public record WaitlistReservation(
            Long bookId,
            Long bookItemId,
            Long userId,
            LocalDateTime expiresAt) {
    }

    private final Map<Long, List<Long>> cartsByUser = new HashMap<>();
    private final Map<Long, List<Long>> waitlistsByBook = new HashMap<>();
    private final Map<Long, WaitlistReservation> reservationByBook = new HashMap<>();
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

    public synchronized void joinWaitlist(Long userId, Long bookId) {
        WaitlistReservation reservation = reservationByBook.get(bookId);
        if (reservation != null && Objects.equals(reservation.userId(), userId)) {
            return;
        }
        List<Long> queue = waitlistsByBook.computeIfAbsent(bookId, id -> new ArrayList<>());
        if (!queue.contains(userId)) {
            queue.add(userId);
        }
    }

    public synchronized int waitlistPosition(Long userId, Long bookId) {
        WaitlistReservation reservation = reservationByBook.get(bookId);
        if (reservation != null && Objects.equals(reservation.userId(), userId)) {
            return 1;
        }
        List<Long> queue = waitlistsByBook.getOrDefault(bookId, List.of());
        int index = queue.indexOf(userId);
        return index >= 0 ? index + 1 : 0;
    }

    public synchronized List<Long> getWaitlistBookIdsForUser(Long userId) {
        List<Long> queuedBookIds = waitlistsByBook.entrySet().stream()
                .filter(entry -> entry.getValue().contains(userId))
                .map(Map.Entry::getKey)
                .toList();
        List<Long> reservedBookIds = reservationByBook.entrySet().stream()
                .filter(entry -> Objects.equals(entry.getValue().userId(), userId))
                .map(Map.Entry::getKey)
                .toList();
        List<Long> merged = new ArrayList<>(queuedBookIds);
        reservedBookIds.stream()
                .filter(bookId -> !merged.contains(bookId))
                .forEach(merged::add);
        return merged;
    }

    public synchronized Optional<WaitlistReservation> reserveForNextWaiter(
            Long bookId,
            Long bookItemId,
            LocalDateTime expiresAt) {
        List<Long> queue = waitlistsByBook.computeIfAbsent(bookId, id -> new ArrayList<>());
        if (queue.isEmpty()) {
            reservationByBook.remove(bookId);
            return Optional.empty();
        }
        Long nextUserId = queue.remove(0);
        if (queue.isEmpty()) {
            waitlistsByBook.remove(bookId);
        }
        WaitlistReservation reservation = new WaitlistReservation(bookId, bookItemId, nextUserId, expiresAt);
        reservationByBook.put(bookId, reservation);
        return Optional.of(reservation);
    }

    public synchronized List<WaitlistReservation> releaseExpiredReservations(LocalDateTime now) {
        List<WaitlistReservation> expired = reservationByBook.values().stream()
                .filter(reservation -> reservation.expiresAt() != null && !reservation.expiresAt().isAfter(now))
                .toList();
        expired.forEach(reservation -> reservationByBook.remove(reservation.bookId()));
        return expired;
    }

    public synchronized boolean consumeReservationForBorrower(
            Long bookId,
            Long bookItemId,
            Long borrowerUserId,
            LocalDateTime now) {
        WaitlistReservation reservation = reservationByBook.get(bookId);
        if (reservation == null) {
            return false;
        }
        boolean valid = Objects.equals(reservation.bookItemId(), bookItemId)
                && Objects.equals(reservation.userId(), borrowerUserId)
                && (reservation.expiresAt() == null || reservation.expiresAt().isAfter(now));
        if (valid) {
            reservationByBook.remove(bookId);
        }
        return valid;
    }

    public synchronized boolean hasActiveReservation(Long bookId, LocalDateTime now) {
        WaitlistReservation reservation = reservationByBook.get(bookId);
        if (reservation == null) {
            return false;
        }
        return reservation.expiresAt() == null || reservation.expiresAt().isAfter(now);
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
