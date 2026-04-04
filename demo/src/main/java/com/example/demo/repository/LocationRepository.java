package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Location;

public interface LocationRepository extends JpaRepository<Location, Integer> {
	Optional<Location> findByRoomNameAndShelfNumber(String roomName, String shelfNumber);
}
