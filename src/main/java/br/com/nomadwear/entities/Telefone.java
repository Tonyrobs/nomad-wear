package br.com.nomadwear.entities;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "telefone")

public class Telefone {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    private UUID id;
    @NotBlank(message = "DDD é obrigatório")
    private String ddd;
    @NotBlank(message = "Número é obrigatório")
    private String numero;

    public Telefone() {
    }

    public Telefone(String ddd, String numero) {
        this.id = UUID.randomUUID();
        this.ddd = ddd;
        this.numero = numero;
    }

    public UUID getId() { return id; }
    public String getDdd() {
        return ddd;
    }
    public void setDdd(String ddd) {
        this.ddd = ddd;
    }
    public String getNumero() {
        return numero;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }
}