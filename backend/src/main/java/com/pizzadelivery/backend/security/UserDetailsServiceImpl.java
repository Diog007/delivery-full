package com.pizzadelivery.backend.security;

import com.pizzadelivery.backend.repository.AdminRepository;
import com.pizzadelivery.backend.repository.CustomerUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final CustomerUserRepository customerUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Tenta encontrar como Admin primeiro
        var admin = adminRepository.findByUsername(username);
        if (admin.isPresent()) {
            return new User(
                    admin.get().getUsername(),
                    admin.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // Se não for admin, tenta encontrar como Cliente (usando email como username)
        var customer = customerUserRepository.findByEmail(username);
        if (customer.isPresent()) {
            return new User(
                    customer.get().getEmail(),
                    customer.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
            );
        }

        throw new UsernameNotFoundException("Usuário não encontrado: " + username);
    }
}