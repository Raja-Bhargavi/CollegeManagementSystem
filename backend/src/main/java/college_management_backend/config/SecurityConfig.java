package college_management_backend.config;

import college_management_backend.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> {})

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // CORS preflight
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // Swagger
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()

                // Public APIs
                .requestMatchers(
                    "/api/public/**"
                ).permitAll()

                // Authentication
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // Admin
                .requestMatchers(
                    "/api/admin/**"
                ).hasRole("ADMIN")

                // Management
                .requestMatchers(
                    "/api/management/**"
                ).hasRole("MANAGEMENT")

                // Student self-service endpoints
                .requestMatchers(
                    "/api/students/me",
                    "/api/course-registrations/me",
                    "/api/attendance/me",
                    "/api/marks/me",
                    "/api/results/me",
                    "/api/fees/me",
                    "/api/payments/me",
                    "/api/applications/me",
                    "/api/notices/me"
                ).hasRole("STUDENT")

                // Faculty self-service
                .requestMatchers(
                        "/api/faculty/me",
                        "/api/course-offerings/me"
                    ).hasRole("FACULTY")
                    
                // Keep support for any singular student URL
                .requestMatchers(
                    "/api/student/**"
                ).hasRole("STUDENT")

                // Everything else requires authentication.
                // Individual controllers use @PreAuthorize
                // for more specific role restrictions.
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }
}