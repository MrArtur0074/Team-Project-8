package com.example.demo.controllers;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/anonimo-controller")
public class MainController {

    @GetMapping
    public ResponseEntity<String> greetAnonimo() {
        return ResponseEntity.ok("Hello Anonimo");
    }


}

