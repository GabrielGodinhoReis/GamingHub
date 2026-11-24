package com.gaminghub.backend.controller;

import com.gaminghub.backend.model.Cliente;
import com.gaminghub.backend.service.ClienteStore;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController {

    private final ClienteStore clientes;

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    private static final String SESSAO = "clienteCodigo";

    public ClienteController(ClienteStore clientes) {
        this.clientes = clientes;
    }

    record Dados(
            Long codigo,
            @NotBlank @Size(max = 255) String nome,
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank String senha,
            @NotBlank @Pattern(regexp = "[0-9]{11}") String documento
    ) {}

    record Credenciais(
            @NotBlank String email,
            @NotBlank String senha
    ) {}

    record EmailCliente(
            @NotBlank @Email String email
    ) {}

    record NovaSenha(
            @NotBlank String email,
            @NotBlank String documento,
            @NotBlank String senha
    ) {}

    private String normalizar(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private Map<String, Object> perfil(Cliente c) {
        return Map.of(
                "codigo", c.codigo,
                "nome", c.nome,
                "email", c.email
        );
    }

    private void exigirTitular(Long codigo, HttpSession sessao) {
        if (codigo == null ||
                !codigo.equals(sessao.getAttribute(SESSAO))) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para acessar este cliente."
            );
        }
    }

    private void salvar(Cliente c, Dados dados) {

        String email = normalizar(dados.email());

        var existente = clientes.buscarPorEmail(email);

        if (existente.isPresent() &&
                !existente.get().codigo.equals(c.codigo)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "E-mail já cadastrado."
            );
        }

        c.nome = dados.nome().trim();
        c.email = email;
        c.documento = dados.documento();

        clientes.salvar(c);
    }

    @GetMapping("/{codigo}")
    public Map<String, Object> buscar(
            @PathVariable Long codigo,
            HttpSession sessao) {

        Cliente c = clientes.buscarPorCodigo(codigo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente não encontrado."
                ));

        exigirTitular(codigo, sessao);

        return perfil(c);
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
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Senha muito longa."
            );
        }

        return encoder.encode(senha);
    }

    @PostMapping("/login")
    public Map<String, Object> login(
            @Valid @RequestBody Credenciais dados,
            HttpServletRequest request) {

        Cliente c = clientes.buscarPorEmail(normalizar(dados.email()))
                .filter(cliente ->
                        encoder.matches(dados.senha(), cliente.senhaHash))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha incorretos."
                ));

        var anterior = request.getSession(false);

        if (anterior != null) {
            anterior.invalidate();
        }

        request.getSession().setAttribute(SESSAO, c.codigo);

        return perfil(c);
    }

    @PutMapping
    public String alterar(
            @Valid @RequestBody Dados dados,
            HttpSession sessao) {

        if (dados.codigo() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Código do cliente não informado."
            );
        }

        Cliente c = clientes.buscarPorCodigo(dados.codigo())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente não encontrado."
                ));

        exigirTitular(dados.codigo(), sessao);

        if (!encoder.matches(dados.senha(), c.senhaHash)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Senha atual incorreta."
            );
        }

        salvar(c, dados);

        return "Cliente alterado com sucesso! " + c.codigo;
    }

    @DeleteMapping("/{codigo}")
    public String excluir(
            @PathVariable Long codigo,
            HttpSession sessao) {

        exigirTitular(codigo, sessao);

        if (clientes.buscarPorCodigo(codigo).isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Cliente não encontrado."
            );
        }

        clientes.excluir(codigo);
        sessao.invalidate();

        return "Cliente removido com sucesso!";
    }

    @PatchMapping("/resetarSenha")
    public String resetarSenha(
            @Valid @RequestBody EmailCliente dados) {

        clientes.buscarPorEmail(normalizar(dados.email()))
                .ifPresent(c -> c.senhaHash = hash("Senha1234"));

        return "Sua senha foi reiniciada, verifique o seu email!";
    }

    @PatchMapping("/alterarSenha")
    public String alterarSenha(
            @Valid @RequestBody NovaSenha dados,
            HttpSession sessao) {

        Cliente c = clientes.buscarPorEmail(normalizar(dados.email()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN
                ));

        exigirTitular(c.codigo, sessao);

        if (!c.documento.equals(dados.documento())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        c.senhaHash = hash(dados.senha());

        return "Sua senha foi alterada, verifique o seu email!";
    }

    @PostMapping("/logout")
    public void logout(HttpSession sessao) {

        if (sessao.getAttribute(SESSAO) != null) {
            sessao.invalidate();
        }
    }
}
