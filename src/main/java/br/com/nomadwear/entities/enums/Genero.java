package br.com.nomadwear.entities.enums;

public enum Genero {
    MASCULINO("Masculino"),
    FEMININO("Feminino"),
    NAO_BINARIO("Não Binário"),
    OUTRO("Outro"),
    PREFIRO_NAO_DIZER("Prefiro Não Dizer");

    private final String nomeExibicao;

    Genero(String nomeExibicao) {
        this.nomeExibicao = nomeExibicao;
    }

    public String getNomeExibicao() {
        return nomeExibicao;
    }
}
