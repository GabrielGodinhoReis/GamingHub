package com.gaminghub.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/sistema")
public class InicializacaoController {

    private static final String IDENTIFICADOR =
            UUID.randomUUID().toString();

    @GetMapping("/inicializacao")
    public Map<String, String> inicializacao() {
        return Map.of("identificador", IDENTIFICADOR);
    }
} 
