package com.universitysearch.backend.exception;

public class UniversityNotFoundException extends RuntimeException {

    public UniversityNotFoundException(Long id) {
        super("University not found with id: " + id);
    }
}
