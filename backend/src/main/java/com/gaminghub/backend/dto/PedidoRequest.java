package com.gaminghub.backend.dto;

import java.util.List;

public record PedidoRequest(
        List<ItemRequest> itens,
        String formaPagamento
) {

    public record ItemRequest(
            String produtoId,
            int quantidade
    ) {}

}
