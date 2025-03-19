package com.example.demo.controllers;

import com.example.demo.models.Answer;
import com.example.demo.models.User;
import com.example.demo.repositories.AnswerRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/answers")
public class AnswerController {

    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    public AnswerController(AnswerRepository answerRepository, UserRepository userRepository) {
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
    }

    // сохранение ответа
    @PostMapping
    public ResponseEntity<Answer> saveAnswer(@RequestBody Answer answer) {
        User user = userRepository.findById(answer.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        answer.setUser(user);
        Answer savedAnswer = answerRepository.save(answer);
        return ResponseEntity.ok(savedAnswer);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Answer>> getUserAnswers(@PathVariable Long userId) {
        List<Answer> answers = answerRepository.findAll()
                .stream()
                .filter(answer -> answer.getUser().getId().equals(userId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(answers);
    }
}
