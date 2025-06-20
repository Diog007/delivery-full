package com.pizzadelivery.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = "http://localhost:8080/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Redefinição de Senha - PizzaExpress");
        message.setText("Para redefinir sua senha, clique no link abaixo:\n\n"
                + resetUrl + "\n\n"
                + "Se você não solicitou uma redefinição de senha, por favor, ignore este e-mail.");

        mailSender.send(message);
    }
}