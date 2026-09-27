package college_management_backend.dto;

public class UserAccountOption {

    private Long userId;
    private String username;
    private String email;

    public UserAccountOption(
            Long userId,
            String username,
            String email) {

        this.userId = userId;
        this.username = username;
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }
}
