package br.com.nomadwear.entities;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "endereco")
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    private final UUID id;
    private String pais;
    private String codigoPostal;
    private String subdivisao; // Estado ou província
    private String cidade;
    private String linha1; // Rua e número
    private String linha2; // Complemento
    private String observacoes;

    public Endereco(String pais, String codigoPostal, String subdivisao, String cidade, String linha1, String linha2, String observacoes) {
        this.id = UUID.randomUUID();
        this.pais = pais;
        this.codigoPostal = codigoPostal;
        this.subdivisao = subdivisao;
        this.cidade = cidade;
        this.linha1 = linha1;
        this.linha2 = linha2;
        this.observacoes = observacoes;
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
    public String getObservacoes() { return observacoes; }
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
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    
}