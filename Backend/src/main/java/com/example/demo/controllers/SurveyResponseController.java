package com.example.demo.controllers;

import com.example.demo.models.SurveyResponse;
import com.example.demo.repositories.SurveyResponseRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/survey-responses")
public class SurveyResponseController {

    private final SurveyResponseRepository surveyResponseRepository;

    public SurveyResponseController(SurveyResponseRepository surveyResponseRepository) {
        this.surveyResponseRepository = surveyResponseRepository;
    }

    @GetMapping
    public List<SurveyResponse> getAllSurveyResponsesWithAnswers() {
        return surveyResponseRepository.findAll();
    }
}
