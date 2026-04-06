package br.com.nomadwear.dto;

import java.math.BigDecimal;

public class ItemPedidoResponseDTO {
    private String nomeProduto;
    private String sku;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    private BigDecimal subtotal;

    public ItemPedidoResponseDTO(String nomeProduto, String sku,
                                 Integer quantidade, BigDecimal precoUnitario) {
        this.nomeProduto = nomeProduto;
        this.sku = sku;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
        this.subtotal = precoUnitario.multiply(new BigDecimal(quantidade));
    }

    public String getNomeProduto() { return nomeProduto; }
    public String getSku() { return sku; }
    public Integer getQuantidade() { return quantidade; }
    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public BigDecimal getSubtotal() { return subtotal; }
}