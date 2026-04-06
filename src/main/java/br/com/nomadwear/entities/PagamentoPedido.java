package br.com.nomadwear.entities;

import br.com.nomadwear.entities.enums.TipoPagamento;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "tb_pagamento_pedido")
public class PagamentoPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    @JsonIgnore
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "cartao_id")
    private CartaoCredito cartaoCredito; // 👈 nullable — só preenchido se for cartão

    @Enumerated(EnumType.STRING)
    private TipoPagamento tipoPagamento; // 👈 CARTAO ou PIX

    private String chavePix; // 👈 nullable — só preenchido se for Pix

    private BigDecimal valorPago;

    public PagamentoPedido() {}

    // Construtor para cartão
    public PagamentoPedido(Pedido pedido, CartaoCredito cartaoCredito, BigDecimal valorPago) {
        this.pedido = pedido;
        this.cartaoCredito = cartaoCredito;
        this.valorPago = valorPago;
        this.tipoPagamento = TipoPagamento.CARTAO;
    }

    // Construtor para Pix
    public PagamentoPedido(Pedido pedido, String chavePix, BigDecimal valorPago) {
        this.pedido = pedido;
        this.chavePix = chavePix;
        this.valorPago = valorPago;
        this.tipoPagamento = TipoPagamento.PIX;
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public CartaoCredito getCartaoCredito() { return cartaoCredito; }
    public void setCartaoCredito(CartaoCredito cartaoCredito) { this.cartaoCredito = cartaoCredito; }

    public TipoPagamento getTipoPagamento() { return tipoPagamento; }
    public void setTipoPagamento(TipoPagamento tipoPagamento) { this.tipoPagamento = tipoPagamento; }

    public String getChavePix() { return chavePix; }
    public void setChavePix(String chavePix) { this.chavePix = chavePix; }

    public BigDecimal getValorPago() { return valorPago; }
    public void setValorPago(BigDecimal valorPago) { this.valorPago = valorPago; }
}