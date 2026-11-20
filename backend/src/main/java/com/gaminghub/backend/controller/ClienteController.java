package com.gaminghub.backend.controller;

import com.gaminghub.backend.model.Cliente;
import com.gaminghub.backend.repository.ClienteRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/cliente")
@Transactional
public class ClienteController {
    private final ClienteRepository clientes;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private static final String SESSAO = "clienteCodigo";

    public ClienteController(ClienteRepository clientes) {
        this.clientes = clientes;
    }

    record Dados(Long codigo, @NotBlank @Size(max=255) String nome,
                 @NotBlank @Email @Size(max=255) String email, @NotBlank String senha,
                 @NotBlank @Pattern(regexp="[0-9]{11}") String documento) {}
    record Credenciais(@NotBlank String email, @NotBlank String senha) {}
    record EmailCliente(@NotBlank @Email String email) {}
    record NovaSenha(@NotBlank String email, @NotBlank String documento, @NotBlank String senha) {}

    private String normalizar(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private Map<String,Object> perfil(Cliente c) {
        return Map.of("codigo", c.codigo, "nome", c.nome, "email", c.email);
    }

    private void exigirTitular(Long codigo, HttpSession sessao) {
        if (codigo == null || !codigo.equals(sessao.getAttribute(SESSAO))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private void salvar(Cliente c, Dados dados) {
        c.nome = dados.nome().trim();
        c.email = normalizar(dados.email());
        c.documento = dados.documento();
        try {
            clientes.saveAndFlush(c);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.", ex);
        }
    }

    @GetMapping("/{codigo}")
    public Map<String,Object> buscar(@PathVariable Long codigo, HttpSession sessao) {
        return clientes.findById(codigo).map(c -> {
            exigirTitular(codigo, sessao);
            return perfil(c);
        }).orElse(Map.of());
    }

    @PostMapping
    public String cadastrar(@Valid @RequestBody Dados dados) {
        Cliente c = new Cliente();
        c.senhaHash = hash(dados.senha());
        salvar(c, dados);
        return "Cliente gravado com sucesso! " + c.codigo;
    }

    private String hash(String senha) {
        if (senha.getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha muito longa.");
        }
        return encoder.encode(senha);
    }

    @PostMapping("/login")
    public Map<String,Object> login(@Valid @RequestBody Credenciais dados, jakarta.servlet.http.HttpServletRequest request) {
        return clientes.findByEmail(normalizar(dados.email()))
            .filter(c -> encoder.matches(dados.senha(), c.senhaHash))
            .map(c -> {
                var anterior = request.getSession(false);
                if (anterior != null) anterior.invalidate();
                request.getSession().setAttribute(SESSAO, c.codigo);
                return perfil(c);
            }).orElse(Map.of());
    }

    @PutMapping
    public String alterar(@Valid @RequestBody Dados dados, HttpSession sessao) {
        var cliente = dados.codigo() == null ? java.util.Optional.<Cliente>empty() : clientes.findById(dados.codigo());
        if (cliente.isEmpty()) return "Cliente não encontrado!";
        exigirTitular(dados.codigo(), sessao);
        Cliente c = cliente.get();
        if (!encoder.matches(dados.senha(), c.senhaHash)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Senha atual incorreta.");
        }
        salvar(c, dados);
        return "Cliente alterado com sucesso! " + c.codigo;
    }

    @DeleteMapping("/{codigo}")
    public String excluir(@PathVariable Long codigo, HttpSession sessao) {
        exigirTitular(codigo, sessao);
        clientes.deleteById(codigo);
        sessao.invalidate();
        return "Cliente removido com sucesso!";
    }

    @PatchMapping("/resetarSenha")
    public String resetarSenha(@Valid @RequestBody EmailCliente dados) {
        clientes.findByEmail(normalizar(dados.email())).ifPresent(c -> c.senhaHash = hash("Senha1234"));
        return "Sua senha foi reiniciada, verifique o seu email!";
    }

    @PatchMapping("/alterarSenha")
    public String alterarSenha(@Valid @RequestBody NovaSenha dados, HttpSession sessao) {
        Cliente c = clientes.findByEmail(normalizar(dados.email()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        exigirTitular(c.codigo, sessao);
        if (!c.documento.equals(dados.documento())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        c.senhaHash = hash(dados.senha());
        return "Sua senha foi alterada, verifique o seu email!";
    }

    @PostMapping("/logout")
    public void logout(HttpSession sessao) {
        if (sessao.getAttribute(SESSAO) != null) sessao.invalidate();
    }
}
