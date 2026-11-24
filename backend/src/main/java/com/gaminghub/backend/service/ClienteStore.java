
package com.gaminghub.backend.service;

import com.gaminghub.backend.model.Cliente;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ClienteStore {

    private final Map<Long, Cliente> clientes = new ConcurrentHashMap<>();

    private final AtomicLong proximoCodigo = new AtomicLong(1);

    public synchronized Cliente salvar(Cliente cliente) {

        for (Cliente existente : clientes.values()) {
            if (existente.email.equalsIgnoreCase(cliente.email)
                    && !existente.codigo.equals(cliente.codigo)) {
                throw new IllegalArgumentException("E-mail já cadastrado.");
            }
        }

        if (cliente.codigo == null) {
            cliente.codigo = proximoCodigo.getAndIncrement();
        }

        clientes.put(cliente.codigo, cliente);

        return cliente;
    }

    public Optional<Cliente> buscarPorCodigo(Long codigo) {
        return Optional.ofNullable(clientes.get(codigo));
    }

    public Optional<Cliente> buscarPorEmail(String email) {
        return clientes.values().stream()
                .filter(c -> c.email.equalsIgnoreCase(email))
                .findFirst();
    }

    public void excluir(Long codigo) {
        clientes.remove(codigo);
    }
}
