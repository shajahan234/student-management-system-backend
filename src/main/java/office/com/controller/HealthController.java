package office.com.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        logger.info("Health check endpoint accessed. Responding with status: ok");
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        return ResponseEntity.ok(response);
    }
}
