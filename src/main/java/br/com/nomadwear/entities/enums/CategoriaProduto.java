package br.com.nomadwear.entities.enums;

public enum CategoriaProduto {
    CAMISETA("Camiseta"),
    CAMISA("Camisa"),
    CALCA("Calça"),
    SHORTS("Shorts"),
    VESTIDO("Vestido"),
    SAIA("Saia"),
    JAQUETA("Jaqueta"),
    MOLETOM("Moletom"),
    CASACO("Casaco"),
    ACESSORIO("Acessório");

    private final String nomeExibicao;

    CategoriaProduto(String nomeExibicao) {
        this.nomeExibicao = nomeExibicao;
    }

    public String getNomeExibicao() { return nomeExibicao; }
}

