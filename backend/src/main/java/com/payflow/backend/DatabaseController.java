package com.payflow.backend;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DatabaseController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/database/health")
    public Map<String, Object> checkDatabase() {
        Integer result = jdbcTemplate.queryForObject(
            "SELECT 1",
            Integer.class
        );

        return Map.of(
            "database", "MySQL",
            "connected", result != null && result == 1,
            "message", "Database connection successful"
        );
    }
}