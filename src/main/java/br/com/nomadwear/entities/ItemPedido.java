package br.com.nomadwear.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "tb_item_pedido")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    @JsonIgnore
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "variacao_produto_id")
    private VariacaoProduto variacaoProduto;

    private Integer quantidade;
    private BigDecimal precoUnitario;

    public ItemPedido() {}

    public ItemPedido(Pedido pedido, VariacaoProduto variacaoProduto, Integer quantidade, BigDecimal precoUnitario) {
        this.pedido = pedido;
        this.variacaoProduto = variacaoProduto;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public VariacaoProduto getVariacaoProduto() { return variacaoProduto; }
    public void setVariacaoProduto(VariacaoProduto variacaoProduto) { this.variacaoProduto = variacaoProduto; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }
}