package br.com.nomadwear.entities.enums;

public enum CorProduto {
    PRETO("Preto"),
    BRANCO("Branco"),
    CINZA("Cinza"),
    AZUL_MARINHO("Azul Marinho"),
    AZUL_CLARO("Azul Claro"),
    VERMELHO("Vermelho"),
    VERDE("Verde"),
    AMARELO("Amarelo"),
    ROSA("Rosa"),
    BEGE("Bege"),
    MARROM("Marrom"),
    LARANJA("Laranja"),
    ROXO("Roxo"),
    VINHO("Vinho");

    private final String nomeExibicao;

    CorProduto(String nomeExibicao) {
        this.nomeExibicao = nomeExibicao;
    }

    public String getNomeExibicao() { return nomeExibicao; }
}