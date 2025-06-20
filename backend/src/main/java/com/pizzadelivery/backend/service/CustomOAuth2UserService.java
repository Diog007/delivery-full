package com.pizzadelivery.backend.service;

import com.pizzadelivery.backend.entity.CustomerUser;
import com.pizzadelivery.backend.repository.CustomerUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final CustomerUserRepository customerUserRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauthUser = super.loadUser(userRequest);
        Map<String, Object> attributes = oauthUser.getAttributes();
        String email = attributes.get("email").toString();

        customerUserRepository.findByEmail(email)
                .orElseGet(() -> {
                    CustomerUser newUser = new CustomerUser();
                    newUser.setEmail(email);
                    newUser.setName(attributes.get("name").toString());
                    newUser.setPassword(null);
                    return customerUserRepository.save(newUser);
                });

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_CUSTOMER")),
                attributes,
                "email"
        );
    }
}