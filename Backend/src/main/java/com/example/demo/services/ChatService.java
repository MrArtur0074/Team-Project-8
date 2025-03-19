package com.example.demo.services;

import com.example.demo.models.Chat;
import com.example.demo.models.Message;
import com.example.demo.models.User;
import com.example.demo.repositories.ChatRepository;
import com.example.demo.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    @Autowired
    public ChatService(ChatRepository chatRepository, MessageRepository messageRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
    }

    // Метод, который теперь принимает Chat и User
    public Chat createChat(Chat chat, User user) {
        chat.setCreatedBy(user);  // Устанавливаем создателя чата
        return chatRepository.save(chat);  // Сохраняем и возвращаем чат
    }

    public void deleteChat(Long id) {
        chatRepository.deleteById(id);
    }

    public List<Message> getMessages(Long chatId) {
        return messageRepository.findByChatId(chatId);
    }

    public Message sendMessage(Long chatId, User sender, String content) {
        Chat chat = chatRepository.findById(chatId).orElseThrow();
        Message message = new Message();
        message.setChat(chat);
        message.setSender(sender);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }
}
