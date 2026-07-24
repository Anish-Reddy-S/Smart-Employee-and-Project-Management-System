package com.enterprise.smartmanager.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String fullName, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Welcome to Enterprise Smart Manager Portal");

            String htmlBody = "<html>"
                    + "<body style='font-family: Arial, sans-serif; color: #333;'>"
                    + "<div style='background: #2563EB; padding: 20px; color: white;'>"
                    + "<h2>Welcome to Smart Manager, " + fullName + "!</h2>"
                    + "</div>"
                    + "<div style='padding: 20px; border: 1px solid #ddd;'>"
                    + "<p>Your account has been successfully created.</p>"
                    + "<p><b>Username:</b> " + username + "</p>"
                    + "<p>Please log in and complete your employee profile setup.</p>"
                    + "</div>"
                    + "</body>"
                    + "</html>";

            helper.setText(htmlBody, true);
            mailSender.send(message);
            logger.info("Welcome email successfully sent to {}", toEmail);
        } catch (MessagingException e) {
            logger.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }
}
