package br.com.nomadwear.entities;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "endereco")
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    private UUID id;
    @NotBlank(message = "País é obrigatório")
    private String pais;
    @NotBlank(message = "CEP é obrigatório")
    private String cep;
    @NotBlank(message = "Estado é obrigatório")
    private String estado; // Estado ou província
    @NotBlank(message = "Cidade é obrigatória")
    private String cidade;
    @NotBlank(message = "Rua é obrigatória")
    private String rua; // Rua
    @NotBlank(message = "Número é obrigatório")
    private String numero; // Número  
    @NotBlank(message = "Bairro é obrigatório")
    private String bairro; // Bairro 
    private String complemento; // Complemento
    private String observacoes;

    public Endereco() {
    }

    public Endereco(String pais, String cep, String estado, String cidade, String rua, String numero, String bairro, String complemento, String observacoes) {
        this.id = UUID.randomUUID();
        this.pais = pais;
        this.cep = cep;
        this.estado = estado;
        this.cidade = cidade;
        this.rua = rua;
        this.numero = numero;
        this.bairro = bairro;
        this.complemento = complemento;
        this.observacoes = observacoes;
    }

    public UUID getId() {
        return id;
    }

    public String getPais() {
        return pais;
    }

    public String getCep() {
        return cep;
    }

    public String getEstado() {
        return estado;
    }

    public String getCidade() {
        return cidade;
    }

    public String getRua() {
        return rua;
    }

    public String getNumero() {
        return numero;
    }

    public String getBairro() {
        return bairro;
    }

    public String getComplemento() {
        return complemento;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}