package college_management_backend.service;

import college_management_backend.dto.LoginRequest;
import college_management_backend.dto.LoginResponse;
import college_management_backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthenticationService(
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        String token =
                jwtService.generateToken(
                        (org.springframework.security.core.userdetails.UserDetails)
                                authentication.getPrincipal()
                );

        return new LoginResponse(
                token,
                authentication.getName(),
                "Login successful"
        );
    }
}