
package com.gaminghub.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gaminghub.backend.model.Produto;

import jakarta.annotation.PostConstruct;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProdutoService {

    private final List<Produto> produtos = new ArrayList<>();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void carregarCatalogo() {
        try {
            ClassPathResource resource =
                    new ClassPathResource("catalogo-produtos.json");

            try (InputStream input = resource.getInputStream()) {

                List<Produto> catalogo = objectMapper.readValue(
                        input,
                        new TypeReference<List<Produto>>() {}
                );

                produtos.addAll(catalogo);
            }

            System.out.println(
                    produtos.size() + " produtos carregados do catálogo."
            );

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Erro ao carregar o catálogo de produtos.",
                    e
            );
        }
    }

    public List<Produto> listarProdutos() {
        return produtos;
    }

    public Produto buscarPorId(String id) {
        return produtos.stream()
                .filter(produto -> produto.getId().equals(id))
                .findFirst()
                .orElse(null);
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
