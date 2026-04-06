package br.com.nomadwear.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class PedidoResponseDTO {
    private UUID idPedido;
    private String status;
    private BigDecimal valorTotal;
    private LocalDateTime dataPedido;
    private List<ItemPedidoResponseDTO> itens;

    public PedidoResponseDTO(UUID idPedido, String status, BigDecimal valorTotal,
                             LocalDateTime dataPedido, List<ItemPedidoResponseDTO> itens) {
        this.idPedido = idPedido;
        this.status = status;
        this.valorTotal = valorTotal;
        this.dataPedido = dataPedido;
        this.itens = itens;
    }

    // Getters
    public UUID getIdPedido() { return idPedido; }
    public String getStatus() { return status; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public LocalDateTime getDataPedido() { return dataPedido; }
    public List<ItemPedidoResponseDTO> getItens() { return itens; }
}