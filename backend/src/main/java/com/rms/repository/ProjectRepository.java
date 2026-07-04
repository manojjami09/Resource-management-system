package com.rms.repository;

import com.rms.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT DISTINCT p FROM Project p JOIN Allocation a ON a.project.id = p.id WHERE a.employee.user.id = :userId AND a.startDate <= CURRENT_DATE AND a.endDate >= CURRENT_DATE")
    List<Project> findActiveProjectsByUserId(@Param("userId") Long userId);
}
