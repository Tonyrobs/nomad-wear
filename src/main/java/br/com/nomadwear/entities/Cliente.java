package br.com.nomadwear.entities;

import br.com.nomadwear.entities.enums.Genero;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.LocalDate;

public class Cliente {
    private final UUID id;
    private String nome;
    private Genero genero;
    private LocalDate dataNascimento;
    private String cpf;
    private String email;
    private String senha;
    private boolean ativo;

    private List<Endereco> enderecos = new ArrayList<>();
    private List<Telefone> telefones = new ArrayList<>();
    private List<CartaoCredito> cartoes = new ArrayList<>();

    public Cliente(String nome, Genero genero, LocalDate dataNascimento, String cpf, String email, String senha, boolean ativo) {
        this.id = UUID.randomUUID();
        this.nome = nome;
        this.genero = genero;
        this.dataNascimento = dataNascimento;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.ativo = ativo;
    }

    public UUID getId() {
        return id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public Genero getGenero() {
        return genero;
    }
    public void setGenero(Genero genero) {
        this.genero = genero;
    }
    public LocalDate getDataNascimento() {
        return dataNascimento;
    }
    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
    public List<Endereco> getEnderecos() {
        return enderecos;
    }
    public void setEnderecos(List<Endereco> enderecos) {
        this.enderecos = enderecos;
    }
    public List<Telefone> getTelefones() {
        return telefones;
    }
    public void setTelefones(List<Telefone> telefones) {
        this.telefones = telefones;
    }
    public List<CartaoCredito> getCartoes() {
        return cartoes;
    }
    public void setCartoes(List<CartaoCredito> cartoes) {
        this.cartoes = cartoes;
    }
    public boolean isAtivo() {
        return ativo;
    }
    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}