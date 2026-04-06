package br.com.nomadwear.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public class PagamentoCartaoDTO {

    @NotNull(message = "O ID do cartão é obrigatório")
    private UUID cartaoId;

    @NotNull(message = "O valor cobrado no cartão é obrigatório")
    @Positive(message = "O valor cobrado deve ser maior que zero")
    private BigDecimal valorCobrado;

    public PagamentoCartaoDTO() {}

    // Getters e Setters
    public UUID getCartaoId() { return cartaoId; }
    public void setCartaoId(UUID cartaoId) { this.cartaoId = cartaoId; }

    public BigDecimal getValorCobrado() { return valorCobrado; }
    public void setValorCobrado(BigDecimal valorCobrado) { this.valorCobrado = valorCobrado; }
}