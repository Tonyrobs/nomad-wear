package br.com.nomadwear.entities;

import java.time.LocalDate;

public class Cliente {
    private String nome;
    private String genero;
    private LocalDate dataNascimento;
    private String cpf;

    private Endereco endereco;
    private Telefone telefone;

    public Cliente() {
    }

    public Cliente(String nome, Endereco endereco) {
        this.nome = nome;
        this.endereco = endereco;
    }

}