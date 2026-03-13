package br.com.nomadwear.entities;

import br.com.nomadwear.entities.enums.Genero;
import java.time.LocalDate;

public class Cliente {
    private String nome;
    private Genero genero;
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