package office.com.service;

import office.com.dto.AuthRequest;
import office.com.dto.AuthResponse;
import office.com.entity.User;
import office.com.repository.UserRepository;
import office.com.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse authenticate(AuthRequest request) {
        if (request == null || request.getUsername() == null || request.getUsername().isBlank()) {
            throw new RuntimeException("Username is required");
        }
        if (request.getPassword() == null) {
            throw new RuntimeException("Password is required");
        }
        User user = userRepository.findByUsername(request.getUsername().trim())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), null);
    }

    public AuthResponse register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Handle Role assignment (default to STUDENT if not provided or invalid)
        if (user.getRole() == null) {
             user.setRole(User.Role.STUDENT);
        }
        
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), null);
    }
}