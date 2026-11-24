
package com.gaminghub.backend.service;

import com.gaminghub.backend.model.Pedido;
import com.gaminghub.backend.model.ItemPedido;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.Comparator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class PedidoStore {

    private final Map<Integer, Pedido> pedidos =
            new ConcurrentHashMap<>();

    private final AtomicInteger proximoCodigo =
            new AtomicInteger(1);

    private final AtomicLong proximoItemId =
            new AtomicLong(1);

    public synchronized Pedido salvar(Pedido pedido) {

        if (pedido.codigoPedido == null) {
            pedido.codigoPedido = proximoCodigo.getAndIncrement();
        }

        for (ItemPedido item : pedido.itens) {
            item.id = proximoItemId.getAndIncrement();
            item.pedido = pedido;
        }

        pedidos.put(pedido.codigoPedido, pedido);

        return pedido;
    }

    public Optional<Pedido> buscarPorCodigo(Integer codigo) {
        return Optional.ofNullable(pedidos.get(codigo));
    }

    public List<Pedido> buscarPorCliente(Long codigoCliente) {
        return pedidos.values().stream()
                .filter(pedido ->
                        pedido.cliente != null &&
                        pedido.cliente.codigo.equals(codigoCliente)
                )
                .sorted(
                        Comparator.comparing(
                                (Pedido pedido) -> pedido.dataPedido
                        ).reversed()
                )
                .toList();
    }

    public void excluir(Integer codigo) {
        pedidos.remove(codigo);
    }
}
