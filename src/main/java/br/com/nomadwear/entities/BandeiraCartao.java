public enum BandeiraCartao {
    VISA("Visa"),
    MASTERCARD("Mastercard"),
    ELO("Elo"),
    AMERICAN_EXPRESS("American Express"),
    HIPERCARD("Hipercard");

    private final String nomeExibicao;

    BandeiraCartao(String nomeExibicao) {
        this.nomeExibicao = nomeExibicao;
    }

    public String getNomeExibicao() {
        return nomeExibicao;
    }
}