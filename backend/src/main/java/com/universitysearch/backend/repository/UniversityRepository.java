package com.universitysearch.backend.repository;

import com.universitysearch.backend.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UniversityRepository extends JpaRepository<University, Long> {

    @Query("""
            SELECT DISTINCT u FROM University u
            LEFT JOIN u.programs p
            WHERE (:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')))
            AND (:country IS NULL OR LOWER(u.country) LIKE LOWER(CONCAT('%', :country, '%')))
            AND (:city IS NULL OR LOWER(u.city) LIKE LOWER(CONCAT('%', :city, '%')))
            AND (:program IS NULL OR LOWER(p) LIKE LOWER(CONCAT('%', :program, '%')))
            """)
    List<University> search(
            @Param("name") String name,
            @Param("country") String country,
            @Param("city") String city,
            @Param("program") String program
    );
}
