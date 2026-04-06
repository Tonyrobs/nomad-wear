package br.com.nomadwear.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import br.com.nomadwear.entities.enums.TipoPagamento;

public class PedidoRequestDTO {

    @NotNull(message = "O ID do cliente é obrigatório")
    private UUID clienteId;

    @NotNull(message = "O endereço de entrega é obrigatório")
    private UUID enderecoId;

    private String cupomCodigo;

    @PositiveOrZero(message = "O valor do frete não pode ser negativo")
    private BigDecimal valorFrete;

    @NotEmpty(message = "O carrinho não pode estar vazio")
    private List<ItemPedidoDTO> itens;

    private List<PagamentoCartaoDTO> pagamentos = new ArrayList<>(); // 👈 removido @NotEmpty

    private List<PagamentoPixDTO> pagamentosPix = new ArrayList<>(); // 👈 novo

    private TipoPagamento tipoPagamento;

    private java.util.List<String> cuponsTroca;

    public PedidoRequestDTO() {}

    // Getters e Setters
    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }

    public UUID getEnderecoId() { return enderecoId; }
    public void setEnderecoId(UUID enderecoId) { this.enderecoId = enderecoId; }

    public String getCupomCodigo() { return cupomCodigo; }
    public void setCupomCodigo(String cupomCodigo) { this.cupomCodigo = cupomCodigo; }

    public BigDecimal getValorFrete() { return valorFrete; }
    public void setValorFrete(BigDecimal valorFrete) { this.valorFrete = valorFrete; }

    public List<ItemPedidoDTO> getItens() { return itens; }
    public void setItens(List<ItemPedidoDTO> itens) { this.itens = itens; }

    public List<PagamentoCartaoDTO> getPagamentos() { return pagamentos; }
    public void setPagamentos(List<PagamentoCartaoDTO> pagamentos) { this.pagamentos = pagamentos; }

    public List<PagamentoPixDTO> getPagamentosPix() { return pagamentosPix; } // 👈 novo
    public void setPagamentosPix(List<PagamentoPixDTO> pagamentosPix) { this.pagamentosPix = pagamentosPix; } // 👈 novo

    public TipoPagamento getTipoPagamento() {
        return tipoPagamento;
    }

    public void setTipoPagamento(TipoPagamento tipoPagamento) {
        this.tipoPagamento = tipoPagamento;
    }

    public java.util.List<String> getCuponsTroca() {
        return cuponsTroca;
    }

    public void setCuponsTroca(java.util.List<String> cuponsTroca) {
        this.cuponsTroca = cuponsTroca;
    }
}