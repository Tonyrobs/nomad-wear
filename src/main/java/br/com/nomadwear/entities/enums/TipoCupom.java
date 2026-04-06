package br.com.nomadwear.entities.enums;

public enum TipoCupom {
    PROMOCIONAL("Promocional"),
    TROCA("Troca");

    private final String descricao;

    TipoCupom(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}