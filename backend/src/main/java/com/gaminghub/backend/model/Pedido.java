package com.gaminghub.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Pedido {

    public Integer codigoPedido;
    public Cliente cliente;
    public LocalDateTime dataPedido;
    public double total;
    public String status;
    public String formaPagamento;
    public List<ItemPedido> itens = new ArrayList<>();
}
