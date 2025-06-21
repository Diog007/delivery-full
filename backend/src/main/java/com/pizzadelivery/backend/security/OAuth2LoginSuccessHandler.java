package com.pizzadelivery.backend.security;

import com.pizzadelivery.backend.entity.CustomerUser;
import com.pizzadelivery.backend.repository.CustomerUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime; // Import necessário
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomerUserRepository customerUserRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        // --- INÍCIO DA ALTERAÇÃO ---
        String email = oauthUser.getAttribute("email");

        // 1. Garante que o usuário exista e atualiza os dados do Google
        CustomerUser customer = customerUserRepository.findByEmail(email)
                .map(existingUser -> {
                    // Usuário já existe, atualiza os dados
                    existingUser.setGoogleId(oauthUser.getAttribute("sub"));
                    existingUser.setName(oauthUser.getAttribute("name"));
                    existingUser.setPictureUrl(oauthUser.getAttribute("picture"));
                    existingUser.setEmailVerified(Boolean.TRUE.equals(oauthUser.getAttribute("email_verified")));
                    existingUser.setLocale(oauthUser.getAttribute("locale"));
                    existingUser.setLastLogin(LocalDateTime.now()); // Atualiza o último login
                    return customerUserRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    // Novo usuário do Google
                    CustomerUser newUser = new CustomerUser();
                    newUser.setEmail(email);
                    newUser.setName(oauthUser.getAttribute("name"));
                    newUser.setGoogleId(oauthUser.getAttribute("sub"));
                    newUser.setPictureUrl(oauthUser.getAttribute("picture"));
                    newUser.setEmailVerified(Boolean.TRUE.equals(oauthUser.getAttribute("email_verified")));
                    newUser.setLocale(oauthUser.getAttribute("locale"));
                    newUser.setLastLogin(LocalDateTime.now());
                    newUser.setPassword(null); // Contas do Google não usam senha local
                    return customerUserRepository.save(newUser);
                });

        // 2. Cria uma lista de permissões contendo APENAS a nossa role customizada
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"));

        // 3. Cria um novo objeto de autenticação com o e-mail do usuário e a permissão correta
        Authentication customAuth = new UsernamePasswordAuthenticationToken(email, null, authorities);

        // 4. Gera o token JWT usando a nossa autenticação customizada
        String token = jwtTokenProvider.createToken(customAuth);

        // 5. Redireciona para o frontend com o token
        String customerName = URLEncoder.encode(customer.getName(), StandardCharsets.UTF_8);
        String targetUrl = "http://localhost:8080/login/success?token=" + token + "&name=" + customerName;
        response.sendRedirect(targetUrl);
        // --- FIM DA ALTERAÇÃO ---
    }
}