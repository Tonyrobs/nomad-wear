package br.com.nomadwear.entities;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "endereco")
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonIgnore
    private Cliente cliente;

    @NotBlank(message = "País é obrigatório")
    private String pais;
    @NotBlank(message = "CEP é obrigatório")
    private String cep;
    @NotBlank(message = "Estado é obrigatório")
    private String estado;
    @NotBlank(message = "Cidade é obrigatória")
    private String cidade;
    @NotBlank(message = "Rua é obrigatória")
    private String rua;
    @NotBlank(message = "Número é obrigatório")
    private String numero;
    @NotBlank(message = "Bairro é obrigatório")
    private String bairro;
    private String complemento;
    private String observacoes;

    public Endereco() {}

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

    public UUID getId() { return id; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}