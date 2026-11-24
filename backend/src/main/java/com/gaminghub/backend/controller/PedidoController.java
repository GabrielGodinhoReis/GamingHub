
package com.gaminghub.backend.controller;

import com.gaminghub.backend.dto.PedidoRequest;
import com.gaminghub.backend.model.Cliente;
import com.gaminghub.backend.model.ItemPedido;
import com.gaminghub.backend.model.Pedido;
import com.gaminghub.backend.model.Produto;
import com.gaminghub.backend.service.ClienteStore;
import com.gaminghub.backend.service.PedidoStore;
import com.gaminghub.backend.service.ProdutoService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/pedido")
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoController {

    private static final String SESSAO = "clienteCodigo";

    private final PedidoStore pedidoStore;
    private final ClienteStore clienteStore;
    private final ProdutoService produtoService;

    public PedidoController(
            PedidoStore pedidoStore,
            ClienteStore clienteStore,
            ProdutoService produtoService
    ) {
        this.pedidoStore = pedidoStore;
        this.clienteStore = clienteStore;
        this.produtoService = produtoService;
    }

    public record ItemResponse(
            String produtoId,
            String nomeProduto,
            String imageUrl,
            double precoUnitario,
            int quantidade
    ) {}

    public record PedidoResponse(
            Integer codigoPedido,
            Long codigoCliente,
            LocalDateTime dataPedido,
            double total,
            String status,
            String formaPagamento,
            List<ItemResponse> itens
    ) {}

    private Cliente obterCliente(HttpSession sessao) {
        Object codigo = sessao.getAttribute(SESSAO);

        if (!(codigo instanceof Long)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Faça login para continuar."
            );
        }

        return clienteStore.buscarPorCodigo((Long) codigo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Cliente não encontrado."
                ));
    }

    private Pedido buscarPedidoDoCliente(
            Integer codigo,
            Cliente cliente
    ) {
        Pedido pedido = pedidoStore.buscarPorCodigo(codigo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Pedido não encontrado."
                ));

        if (!pedido.cliente.codigo.equals(cliente.codigo)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem acesso a este pedido."
            );
        }

        return pedido;
    }

    private void validarPedido(PedidoRequest request) {

        if (request == null ||
                request.itens() == null ||
                request.itens().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O pedido precisa possuir pelo menos um item."
            );
        }

        if (request.formaPagamento() == null ||
                !List.of("credit", "debit", "pix", "paypal")
                        .contains(request.formaPagamento())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Forma de pagamento inválida."
            );
        }

        for (PedidoRequest.ItemRequest item : request.itens()) {

            if (item == null ||
                    item.produtoId() == null ||
                    item.produtoId().isBlank() ||
                    item.quantidade() <= 0) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Dados de produto inválidos."
                );
            }
        }
    }

    private void preencherItens(
            Pedido pedido,
            PedidoRequest request
    ) {
        List<ItemPedido> novosItens = new ArrayList<>();

        for (PedidoRequest.ItemRequest item : request.itens()) {

            Produto produto = produtoService.buscarPorId(
                    item.produtoId()
            );

            if (produto == null) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Produto não encontrado: " + item.produtoId()
                );
            }

            if (!produto.isInStock()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Produto sem estoque: " + produto.getName()
                );
            }

            ItemPedido novoItem = new ItemPedido();

            novoItem.pedido = pedido;
            novoItem.produtoId = produto.getId();
            novoItem.nomeProduto = produto.getName();
            novoItem.imageUrl = produto.getImageUrl();

            Double precoPromocional = produto.getPromotionalPrice();

            if (precoPromocional != null &&
                    precoPromocional > 0 &&
                    precoPromocional < produto.getPrice()) {

                novoItem.precoUnitario = precoPromocional;

            } else {

                novoItem.precoUnitario = produto.getPrice();
            }

            novoItem.quantidade = item.quantidade();

            novosItens.add(novoItem);
        }

        pedido.itens.clear();
        pedido.itens.addAll(novosItens);
    }

    private double calcularTotal(Pedido pedido) {
        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedido item : pedido.itens) {

            BigDecimal preco = BigDecimal.valueOf(
                    item.precoUnitario
            );

            BigDecimal quantidade = BigDecimal.valueOf(
                    item.quantidade
            );

            total = total.add(preco.multiply(quantidade));
        }

        return total.setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private PedidoResponse converterResposta(Pedido pedido) {

        List<ItemResponse> itens = pedido.itens.stream()
                .map(item -> new ItemResponse(
                        item.produtoId,
                        item.nomeProduto,
                        item.imageUrl,
                        item.precoUnitario,
                        item.quantidade
                ))
                .toList();

        return new PedidoResponse(
                pedido.codigoPedido,
                pedido.cliente.codigo,
                pedido.dataPedido,
                pedido.total,
                pedido.status,
                pedido.formaPagamento,
                itens
        );
    }

    // LISTAR PEDIDOS DO CLIENTE LOGADO
    @GetMapping("/meus-pedidos")
    public List<PedidoResponse> buscarMeusPedidos(
            HttpSession sessao
    ) {
        Cliente cliente = obterCliente(sessao);

        return pedidoStore.buscarPorCliente(cliente.codigo)
                .stream()
                .map(this::converterResposta)
                .toList();
    }

    // BUSCAR UM PEDIDO ESPECÍFICO
    @GetMapping("/{codigo}")
    public PedidoResponse buscarPedido(
            @PathVariable Integer codigo,
            HttpSession sessao
    ) {
        Cliente cliente = obterCliente(sessao);

        Pedido pedido = buscarPedidoDoCliente(codigo, cliente);

        return converterResposta(pedido);
    }

    // CADASTRAR PEDIDO
    @PostMapping
    public PedidoResponse cadastrarPedido(
            @RequestBody PedidoRequest request,
            HttpSession sessao
    ) {
        Cliente cliente = obterCliente(sessao);

        validarPedido(request);

        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.dataPedido = LocalDateTime.now();
        pedido.status = "SIMULADO";
        pedido.formaPagamento = request.formaPagamento();

        preencherItens(pedido, request);

        pedido.total = calcularTotal(pedido);

        pedidoStore.salvar(pedido);

        return converterResposta(pedido);
    }

    // ALTERAR PEDIDO
    @PutMapping("/{codigo}")
    public PedidoResponse alterarPedido(
            @PathVariable Integer codigo,
            HttpSession sessao
    ) {
        Cliente cliente = obterCliente(sessao);

        buscarPedidoDoCliente(codigo, cliente);

        throw new ResponseStatusException(
                HttpStatus.METHOD_NOT_ALLOWED,
                "Não é permitido alterar um pedido já criado."
        );
    }

    // EXCLUIR PEDIDO
    @DeleteMapping("/{codigo}")
    public void excluirPedido(
            @PathVariable Integer codigo,
            HttpSession sessao
    ) {
        obterCliente(sessao);

        throw new ResponseStatusException(
                HttpStatus.METHOD_NOT_ALLOWED,
                "Não é permitido excluir pedidos."
        );
    }
}
