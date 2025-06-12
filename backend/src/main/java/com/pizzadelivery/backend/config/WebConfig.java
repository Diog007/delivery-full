package com.pizzadelivery.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapeia a URL /images/** para o diretório de uploads no sistema de arquivos
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:./uploads/images/");
    }
}