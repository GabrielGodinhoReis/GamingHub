
package com.gaminghub.backend.controller;

import com.gaminghub.backend.dto.LoginRequest;
import com.gaminghub.backend.dto.LoginResponse;
import com.gaminghub.backend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
    origins = "http://localhost:4200",
    allowCredentials = "true"
)
public class AuthController {

    private final AuthService authService;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(
        AuthService authService,
        SecurityContextRepository securityContextRepository
    ) {
        this.authService = authService;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
        @RequestBody LoginRequest request,
        HttpServletRequest httpRequest,
        HttpServletResponse httpResponse
    ) {

        boolean autenticado = authService.autenticar(
            request.email(),
            request.password()
        );

        if (!autenticado) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("E-mail ou senha incorretos.");
        }

        Authentication authentication =
            new UsernamePasswordAuthenticationToken(
                request.email(),
                null,
                AuthorityUtils.createAuthorityList("ROLE_ADMIN")
            );

        SecurityContext context =
            SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        securityContextRepository.saveContext(
            context,
            httpRequest,
            httpResponse
        );

        LoginResponse response = new LoginResponse(
            request.email(),
            "Administrador",
            "ADMIN"
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> verificarSessao(
        Authentication authentication
    ) {

        if (
            authentication == null ||
            !authentication.isAuthenticated() ||
            !authentication.getAuthorities().stream()
                .anyMatch(authority ->
                    authority.getAuthority().equals("ROLE_ADMIN")
                )
        ) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
        }

        LoginResponse response = new LoginResponse(
            authentication.getName(),
            "Administrador",
            "ADMIN"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
        HttpServletRequest request,
        HttpServletResponse response
    ) {

        Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

        new SecurityContextLogoutHandler().logout(
            request,
            response,
            authentication
        );

        return ResponseEntity.noContent().build();
    }
}
