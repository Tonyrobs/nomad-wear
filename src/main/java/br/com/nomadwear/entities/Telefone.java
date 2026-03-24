package br.com.nomadwear.entities;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "telefone")
public class Telefone {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonIgnore
    private Cliente cliente;  // 👈 campo que estava faltando

    @NotBlank(message = "DDD é obrigatório")
    private String ddd;

    @NotBlank(message = "Número é obrigatório")
    private String numero;

    public Telefone() {}

    public Telefone(String ddd, String numero) {
        this.id = UUID.randomUUID();
        this.ddd = ddd;
        this.numero = numero;
    }

    public UUID getId() { return id; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public String getDdd() { return ddd; }
    public void setDdd(String ddd) { this.ddd = ddd; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
}