package com.example.demo.repositories;

import com.example.demo.models.Chat;
import com.example.demo.models.Survey;
import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey> findByCreatedBy(User user);

}
