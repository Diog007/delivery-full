package com.pizzadelivery.backend.security;

import com.pizzadelivery.backend.entity.CustomerUser; // Adicione esta importação se faltar
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
        var customerOpt = customerUserRepository.findByEmail(username);
        if (customerOpt.isPresent()) {
            CustomerUser customer = customerOpt.get();

            // *** INÍCIO DA CORREÇÃO ***
            // Se o usuário foi encontrado mas não possui senha, significa que ele se
            // cadastrou via Google. Lançamos uma exceção específica para tratar isso.
            if (customer.getPassword() == null || customer.getPassword().isEmpty()) {
                throw new UsernameNotFoundException("Usuário registrado com o Google. Por favor, utilize o botão 'Login com Google'.");
            }
            // *** FIM DA CORREÇÃO ***

            return new User(
                    customer.getEmail(),
                    customer.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
            );
        }

        throw new UsernameNotFoundException("Usuário não encontrado: " + username);
    }
}