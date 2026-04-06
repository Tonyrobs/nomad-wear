package br.com.nomadwear.entities.enums;

public enum TamanhoProduto {
    PP("PP"),
    P("P"),
    M("M"),
    G("G"),
    GG("GG"),
    XGG("XGG");

    private final String nomeExibicao;

    TamanhoProduto(String nomeExibicao) {
        this.nomeExibicao = nomeExibicao;
    }

    public String getNomeExibicao() { return nomeExibicao; }
}