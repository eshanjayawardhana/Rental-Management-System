package com.example.Jay_Lighting_Backend.repository;

import com.example.Jay_Lighting_Backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository <Employee, Long> {
}
