package br.com.nomadwear.entities;

import java.time.YearMonth;
import java.util.UUID;

import br.com.nomadwear.entities.enums.BandeiraCartao;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.YearMonthDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.YearMonthSerializer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "cartao_credito")

public class CartaoCredito {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    private UUID id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonIgnore
    private Cliente cliente;
    @NotBlank(message = "Número do cartão é obrigatório")
    private String numeroCartao;
    @NotBlank(message = "Nome do titular é obrigatório")
    private String nomeTitular;
    private YearMonth dataValidade;
    @NotBlank(message = "Código de segurança é obrigatório")
    private String codigoSeguranca;
    private BandeiraCartao bandeira;

    public CartaoCredito() {
    }

    public CartaoCredito(String numeroCartao, String nomeTitular, YearMonth dataValidade, String codigoSeguranca, BandeiraCartao bandeira) {
        this.id = UUID.randomUUID();
        this.numeroCartao = numeroCartao;
        this.nomeTitular = nomeTitular;
        this.dataValidade = dataValidade;
        this.codigoSeguranca = codigoSeguranca;
        this.bandeira = bandeira;
    }
    // Getters e Setters

    public Cliente getCliente() { return cliente; }

    public void setCliente(Cliente cliente) { this.cliente = cliente; }

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