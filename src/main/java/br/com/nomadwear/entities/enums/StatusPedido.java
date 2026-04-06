package br.com.nomadwear.entities.enums;

public enum StatusPedido {
    EM_PROCESSAMENTO("Em Processamento"),
    PAGAMENTO_APROVADO("Pagamento Aprovado"),
    PAGAMENTO_RECUSADO("Pagamento Recusado"),
    EM_TRANSITO("Em Trânsito"),
    ENTREGUE("Entregue"),
    CANCELADO("Cancelado");

    private final String descricao;

    StatusPedido(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}