package br.com.nomadwear.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class ItemPedidoDTO {

    @NotNull(message = "A variação do produto (SKU) é obrigatória")
    private UUID variacaoProdutoId;

    @Min(value = 1, message = "A quantidade deve ser pelo menos 1")
    private Integer quantidade;

    public ItemPedidoDTO() {}

    // Getters e Setters
    public UUID getVariacaoProdutoId() { return variacaoProdutoId; }
    public void setVariacaoProdutoId(UUID variacaoProdutoId) { this.variacaoProdutoId = variacaoProdutoId; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
}