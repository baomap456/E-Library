package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.MembershipType;

public interface MembershipTypeRepository extends JpaRepository<MembershipType, Integer> {
    Optional<MembershipType> findByName(String name);
}
