package college_management_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import college_management_backend.security.JwtAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // =================================================
            // CSRF
            // =================================================

            .csrf(csrf -> csrf.disable())

            // =================================================
            // CORS
            // =================================================

            .cors(cors -> {})

            // =================================================
            // SESSION MANAGEMENT
            // =================================================

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            // =================================================
            // URL AUTHORIZATION
            // =================================================

            .authorizeHttpRequests(auth -> auth

                // -------------------------------------------------
                // PUBLIC ENDPOINTS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/auth/**",

                        "/api/public/**",

                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**"
                ).permitAll()

                // -------------------------------------------------
                // STUDENT SELF-SERVICE
                // -------------------------------------------------

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

                // -------------------------------------------------
                // FACULTY SELF-SERVICE
                // -------------------------------------------------

                .requestMatchers(
                        "/api/faculty/me",
                        "/api/course-offerings/me",
                        "/api/attendance/faculty/me",
                        "/api/examinations/faculty/me",
                        "/api/marks/faculty/me",
                        "/api/results/faculty/me",
                        "/api/notices/faculty/me"
                ).hasRole("FACULTY")

                // -------------------------------------------------
                // STUDENT MODULE
                // -------------------------------------------------

                .requestMatchers(
                        "/api/student/**"
                ).hasRole("STUDENT")

                // -------------------------------------------------
                // STUDENTS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/students/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // FACULTY
                // -------------------------------------------------

                .requestMatchers(
                        "/api/faculty/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // STAFF
                // -------------------------------------------------

                .requestMatchers(
                        "/api/staff/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // APPLICATIONS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/applications/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "STUDENT",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // COURSES
                // -------------------------------------------------

                .requestMatchers(
                        "/api/courses/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // COURSE OFFERINGS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/course-offerings/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // COURSE REGISTRATIONS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/course-registrations/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "STUDENT",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // DEPARTMENTS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/departments/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // EVENTS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/events/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // EXAMINATIONS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/examinations/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // MARKS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/marks/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // ATTENDANCE
                // -------------------------------------------------

                .requestMatchers(
                        "/api/attendance/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "STUDENT",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // RESULTS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/results/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "STUDENT",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // NOTICES
                // -------------------------------------------------

                .requestMatchers(
                        "/api/notices/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "FACULTY",
                        "STUDENT",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // FEES
                // -------------------------------------------------

                .requestMatchers(
                        "/api/fees/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "STUDENT",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // PAYMENTS
                // -------------------------------------------------

                .requestMatchers(
                        "/api/payments/**"
                ).hasAnyRole(
                        "ADMIN",
                        "STAFF",
                        "STUDENT",
                        "MANAGEMENT"
                )

                // -------------------------------------------------
                // EVERYTHING ELSE
                // -------------------------------------------------

                .anyRequest().authenticated()
            )

            // =================================================
            // JWT FILTER
            // =================================================

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
}