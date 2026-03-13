import java.util.UUID;

public class Endereco {
    private final UUID id;
    private String pais;
    private String codigoPostal;
    private String subdivisao; // Estado ou província
    private String cidade;
    private String linha1; // Rua e número
    private String linha2; // Complemento

    public Endereco(String pais, String codigoPostal, String subdivisao, String cidade, String linha1, String linha2) {
        this.id = UUID.randomUUID();
        this.pais = pais;
        this.codigoPostal = codigoPostal;
        this.subdivisao = subdivisao;
        this.cidade = cidade;
        this.linha1 = linha1;
        this.linha2 = linha2;
    }

    // Getters e Setters
    public UUID getId() {
        return id;
    }
    public String getPais() {
        return pais;
    }
    public String getCodigoPostal() {
        return codigoPostal;
    }
    public String getSubdivisao() {
        return subdivisao;
    }
    public String getCidade() {
        return cidade;
    }
    public String getLinha1() {
        return linha1;
    }
    public String getLinha2() {
        return linha2;
    }
    public void setPais(String pais) {
        this.pais = pais;
    }
    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }
    public void setSubdivisao(String subdivisao) {
        this.subdivisao = subdivisao;
    }
    public void setCidade(String cidade) {
        this.cidade = cidade;
    }
    public void setLinha1(String linha1) {
        this.linha1 = linha1;
    }
    public void setLinha2(String linha2) {
        this.linha2 = linha2;
    }
    
}