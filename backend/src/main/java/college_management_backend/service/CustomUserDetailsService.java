package college_management_backend.service;

import college_management_backend.entity.User;
import college_management_backend.repository.UserRepository;
import college_management_backend.repository.UserRoleRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    public CustomUserDetailsService(
            UserRepository userRepository,
            UserRoleRepository userRoleRepository) {

        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found: " + username
                        )
                );

        List<String> roleNames =
                userRoleRepository.findRoleNamesByUserId(
                        user.getUserId()
                );

        if (roleNames == null || roleNames.isEmpty()) {

            throw new UsernameNotFoundException(
                    "No role assigned to user: " + username
            );
        }

        String[] authorities = roleNames.stream()
                .filter(role -> role != null && !role.isBlank())
                .map(role -> {

                    String normalizedRole =
                            role.trim().toUpperCase();

                    if (normalizedRole.startsWith("ROLE_")) {
                        return normalizedRole;
                    }

                    return "ROLE_" + normalizedRole;
                })
                .toArray(String[]::new);

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .accountLocked(false)
                .disabled(
                        !"ACTIVE".equalsIgnoreCase(
                                user.getAccountStatus()
                        )
                )
                .build();
    }
}