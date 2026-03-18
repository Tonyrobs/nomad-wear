package br.com.nomadwear.entities;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "telefone")

public class Telefone {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    private final UUID id;
    private String ddd;
    private String numero;

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