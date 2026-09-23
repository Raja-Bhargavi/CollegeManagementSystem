package college_management_backend.service;

import college_management_backend.entity.User;
import college_management_backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import college_management_backend.repository.UserRoleRepository;
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
                                "User not found: " + username));

        List<String> roleNames =
                userRoleRepository.findRoleNamesByUserId(user.getUserId());

        String[] authorities = roleNames.stream()
                .map(role -> "ROLE_" + role)
                .toArray(String[]::new);

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .accountLocked(false)
                .disabled(!"ACTIVE".equalsIgnoreCase(user.getAccountStatus()))
                .build();
    }
}