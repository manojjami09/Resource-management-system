package com.rms.repository;

import java.time.LocalDate;

import com.rms.entity.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllocationRepository extends JpaRepository<Allocation, Long> {

    List<Allocation> findByEmployeeId(Long employeeId);
    List<Allocation> findByProjectId(Long projectId);
    void deleteByProjectId(Long projectId);

    @Query("SELECT COALESCE(SUM(a.allocationPercent), 0) FROM Allocation a WHERE a.employee.id = :employeeId")
    Integer sumAllocationPercentByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT COALESCE(SUM(a.allocationPercent), 0) FROM Allocation a WHERE a.employee.id = :employeeId AND a.startDate <= CURRENT_DATE AND a.endDate >= CURRENT_DATE")
    Integer sumActiveAllocationPercentByEmployeeId(@Param("employeeId") Long employeeId);

    List<Allocation> findByEmployeeIdOrderByStartDateDesc(Long employeeId);
    
    List<Allocation> findByEndDateBetween(LocalDate start, LocalDate end);
}
