
package com.gaminghub.backend.service;

import com.gaminghub.backend.model.Produto;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProdutoService {

    private final List<Produto> produtos = new ArrayList<>();

    public List<Produto> listarProdutos() {
        return produtos;
    }

    public Produto cadastrarProduto(Produto produto) {
        produto.setId(UUID.randomUUID().toString());
        produtos.add(produto);
        return produto;
    }

    public Produto atualizarProduto(String id, Produto produtoAtualizado) {

        for (int i = 0; i < produtos.size(); i++) {

            if (produtos.get(i).getId().equals(id)) {

                produtoAtualizado.setId(id);
                produtos.set(i, produtoAtualizado);

                return produtoAtualizado;
            }
        }

        return null;
    }

    public boolean excluirProduto(String id) {

        return produtos.removeIf(
            produto -> produto.getId().equals(id)
        );
    }
}
