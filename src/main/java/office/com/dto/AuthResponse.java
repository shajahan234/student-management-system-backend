package office.com.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String role;
    private String error;

    public AuthResponse() {
    }

    public AuthResponse(String token, String username, String role, String error) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.error = error;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}