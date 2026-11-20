package com.gaminghub.backend.model;

import jakarta.persistence.*;

@Entity
public class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long codigo;
    @Column(nullable = false)
    public String nome;
    @Column(nullable = false, unique = true)
    public String email;
    @Column(nullable = false)
    public String senhaHash;
    @Column(nullable = false, length = 11)
    public String documento;
}
