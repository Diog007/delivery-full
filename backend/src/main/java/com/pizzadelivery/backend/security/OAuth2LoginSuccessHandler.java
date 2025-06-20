package com.pizzadelivery.backend.security;

import com.pizzadelivery.backend.entity.CustomerUser; // ADICIONADO
import com.pizzadelivery.backend.repository.CustomerUserRepository; // ADICIONADO
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // ADICIONADO
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // ADICIONADO
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections; // ADICIONADO
import java.util.List; // ADICIONADO

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomerUserRepository customerUserRepository; // ADICIONADO

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        // 1. Garante que o usuário exista no nosso banco de dados
        CustomerUser customer = customerUserRepository.findByEmail(email)
                .orElseGet(() -> {
                    CustomerUser newUser = new CustomerUser();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setPassword(null);
                    return customerUserRepository.save(newUser);
                });

        // 2. Cria uma lista de permissões contendo APENAS a nossa role customizada
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"));

        // 3. Cria um novo objeto de autenticação com o e-mail do usuário e a permissão correta
        Authentication customAuth = new UsernamePasswordAuthenticationToken(email, null, authorities);

        // 4. Gera o token JWT usando a nossa autenticação customizada
        String token = jwtTokenProvider.createToken(customAuth);

        // 5. Redireciona para o frontend com o token que agora contém a ROLE_CUSTOMER
        String customerName = URLEncoder.encode(name, StandardCharsets.UTF_8);
        String targetUrl = "http://localhost:8080/login/success?token=" + token + "&name=" + customerName;
        response.sendRedirect(targetUrl);
    }
}