package com.example.demo.security;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Properties;
//import javax.mail.*;
//import javax.mail.internet.*;

public class EmailSender {
    public static void main(String[] args) {
        // Настройки SMTP
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.yourserver.com"); // Замените на ваш SMTP-сервер
        props.put("mail.smtp.port", "465"); // Или используйте 587 для TLS
        props.put("mail.smtp.ssl.enable", "true"); // Включить SSL
        props.put("mail.smtp.ssl.checkserveridentity", "false"); // Отключить проверку SSL-сертификатов

        // Учетные данные для почты
        String username = "your-email@example.com";
        String password = "your-email-password";

        // Создание сессии
        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            // Создание и отправка письма
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("your-email@example.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse("recipient@example.com"));
            message.setSubject("Test Email");
            message.setText("This is a test email with SSL verification disabled.");

            Transport.send(message);

            System.out.println("Email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
