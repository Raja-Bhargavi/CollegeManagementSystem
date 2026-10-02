package college_management_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import college_management_backend.security.JwtAuthenticationFilter;


@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> {})

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        /*
                         * Public authentication endpoints
                         */
                        .requestMatchers(
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()


                        /*
                         * Student self-service endpoints
                         */
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


                        /*
                         * Faculty self-service endpoints
                         */
                        .requestMatchers(
                                "/api/faculty/me",
                                "/api/course-offerings/me",
                                "/api/attendance/faculty/me",
                                "/api/examinations/faculty/me",
                                "/api/marks/faculty/me",
                                "/api/results/faculty/me",
                                "/api/notices/faculty/me"
                        ).hasRole("FACULTY")


                        /*
                         * Student-specific API
                         */
                        .requestMatchers(
                                "/api/student/**"
                        ).hasRole("STUDENT")


                        /*
                         * General APIs
                         *
                         * These are additionally protected by
                         * @PreAuthorize in their controllers.
                         */
                        .requestMatchers(
                                "/api/students/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY"
                        )

                        .requestMatchers(
                                "/api/faculty/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY"
                        )

                        .requestMatchers(
                                "/api/staff/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF"
                        )

                        .requestMatchers(
                                "/api/applications/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "STUDENT"
                        )

                        .requestMatchers(
                                "/api/courses/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY"
                        )

                        .requestMatchers(
                                "/api/course-offerings/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY"
                        )

                        .requestMatchers(
                                "/api/course-registrations/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY",
                                "STUDENT"
                        )

                        .requestMatchers(
                                "/api/departments/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF"
                        )

                        .requestMatchers(
                                "/api/events/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY"
                        )

                        .requestMatchers(
                                "/api/examinations/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY"
                        )

                        .requestMatchers(
                                "/api/marks/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY"
                        )

                        .requestMatchers(
                                "/api/attendance/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY",
                                "STUDENT"
                        )

                        .requestMatchers(
                                "/api/results/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY",
                                "STUDENT"
                        )

                        .requestMatchers(
                                "/api/notices/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "FACULTY",
                                "STUDENT"
                        )

                        .requestMatchers(
                                "/api/fees/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "STUDENT"
                        )

                        .requestMatchers(
                                "/api/payments/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF",
                                "STUDENT"
                        )


                        /*
                         * Any other API endpoint requires
                         * authentication.
                         */
                        .anyRequest().authenticated()
                )

                /*
                 * JWT authentication filter
                 */
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

        @Bean
        public AuthenticationManager authenticationManager(
                AuthenticationConfiguration configuration)
                throws Exception {

        return configuration.getAuthenticationManager();
        }
}