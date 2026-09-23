package college_management_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @GetMapping("/health")
    public Map<String, String> health() {

        return Map.of(
                "status", "success",
                "message", "Public API is accessible"
        );
    }

    @GetMapping("/about")
    public Map<String, String> about() {

        return Map.of(
                "status", "success",
                "name", "VNIT College Management Portal",
                "message", "Welcome to the public portal"
        );
    }

    @GetMapping("/contact")
    public Map<String, String> contact() {

        return Map.of(
                "status", "success",
                "email", "info@vnit.ac.in",
                "message", "Contact information"
        );
    }
}