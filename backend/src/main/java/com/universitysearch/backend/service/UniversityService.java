package com.universitysearch.backend.service;

import com.universitysearch.backend.dto.UniversityDTO;
import com.universitysearch.backend.entity.University;
import com.universitysearch.backend.exception.UniversityNotFoundException;
import com.universitysearch.backend.repository.UniversityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UniversityService {

    private final UniversityRepository universityRepository;

    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    @Transactional(readOnly = true)
    public List<UniversityDTO> getAll() {
        return universityRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public UniversityDTO getById(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new UniversityNotFoundException(id));
        return toDTO(university);
    }

    public UniversityDTO create(UniversityDTO dto) {
        University university = toEntity(dto);
        university.setId(null);
        University saved = universityRepository.save(university);
        return toDTO(saved);
    }

    public UniversityDTO update(Long id, UniversityDTO dto) {
        University existing = universityRepository.findById(id)
                .orElseThrow(() -> new UniversityNotFoundException(id));

        existing.setName(dto.getName());
        existing.setCountry(dto.getCountry());
        existing.setCity(dto.getCity());
        existing.setWebsite(dto.getWebsite());
        existing.setDescription(dto.getDescription());
        existing.setPrograms(dto.getPrograms());
        existing.setTuition(dto.getTuition());
        existing.setCurrency(dto.getCurrency());
        existing.setAcceptanceRate(dto.getAcceptanceRate());
        existing.setRanking(dto.getRanking());

        University saved = universityRepository.save(existing);
        return toDTO(saved);
    }

    public void delete(Long id) {
        if (!universityRepository.existsById(id)) {
            throw new UniversityNotFoundException(id);
        }
        universityRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<UniversityDTO> search(String name, String country, String city, String program) {
        return universityRepository.search(
                        blankToNull(name),
                        blankToNull(country),
                        blankToNull(city),
                        blankToNull(program)
                ).stream()
                .map(this::toDTO)
                .toList();
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private UniversityDTO toDTO(University university) {
        UniversityDTO dto = new UniversityDTO();
        dto.setId(university.getId());
        dto.setName(university.getName());
        dto.setCountry(university.getCountry());
        dto.setCity(university.getCity());
        dto.setWebsite(university.getWebsite());
        dto.setDescription(university.getDescription());
        dto.setPrograms(university.getPrograms());
        dto.setTuition(university.getTuition());
        dto.setCurrency(university.getCurrency());
        dto.setAcceptanceRate(university.getAcceptanceRate());
        dto.setRanking(university.getRanking());
        return dto;
    }

    private University toEntity(UniversityDTO dto) {
        University university = new University();
        university.setId(dto.getId());
        university.setName(dto.getName());
        university.setCountry(dto.getCountry());
        university.setCity(dto.getCity());
        university.setWebsite(dto.getWebsite());
        university.setDescription(dto.getDescription());
        university.setPrograms(dto.getPrograms());
        university.setTuition(dto.getTuition());
        university.setCurrency(dto.getCurrency());
        university.setAcceptanceRate(dto.getAcceptanceRate());
        university.setRanking(dto.getRanking());
        return university;
    }
}
