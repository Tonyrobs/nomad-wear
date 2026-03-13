import java.time.YearMonth;
import java.util.UUID;

public class CartaoCredito {
    private final UUID id;
    private String numeroCartao;
    private String nomeTitular;
    private YearMonth dataValidade;
    private String codigoSeguranca;
    private BandeiraCartao bandeira;    
       
    public CartaoCredito(String numeroCartao, String nomeTitular, YearMonth dataValidade, String codigoSeguranca, BandeiraCartao bandeira, String cpfTitular) {
        this.id = UUID.randomUUID();
        this.numeroCartao = numeroCartao;
        this.nomeTitular = nomeTitular;
        this.dataValidade = dataValidade;
        this.codigoSeguranca = codigoSeguranca;
        this.bandeira = bandeira;
    }
    // Getters e Setters
    public UUID getId() {
        return id;
    }

    public String getNumeroCartao() {
        return numeroCartao;
    }

    public String getNomeTitular() {
        return nomeTitular;
    }

    public YearMonth getDataValidade() {
        return dataValidade;
    }

    public String getCodigoSeguranca() {
        return codigoSeguranca;
    }

    public BandeiraCartao getBandeira() {
        return bandeira;
    }

    public void setNumeroCartao(String numeroCartao) {
        this.numeroCartao = numeroCartao;
    }   

    public void setNomeTitular(String nomeTitular) {
        this.nomeTitular = nomeTitular;
    }

    public void setDataValidade(YearMonth dataValidade) {
        this.dataValidade = dataValidade;
    }

    public void setCodigoSeguranca(String codigoSeguranca) {
        this.codigoSeguranca = codigoSeguranca;
    }

    public void setBandeira(BandeiraCartao bandeira) {
        this.bandeira = bandeira;
    }
    
}