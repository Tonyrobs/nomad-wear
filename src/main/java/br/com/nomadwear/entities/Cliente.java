package br.com.nomadwear.entities;

import br.com.nomadwear.entities.enums.Genero;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.LocalDate;

@Entity
@Table(name = "cliente")

public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    private UUID id;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Enumerated(EnumType.STRING)
    private Genero genero;

    private LocalDate dataNascimento;

    @NotBlank(message = "O CPF é obrigatório")
    @org.hibernate.validator.constraints.br.CPF(message = "CPF em formato inválido")
    private String cpf;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "E-mail em formato inválido")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @com.fasterxml.jackson.annotation.JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;
    private boolean ativo;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Endereco> enderecos = new ArrayList<>();

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Telefone> telefones = new ArrayList<>();

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartaoCredito> cartoes = new ArrayList<>();

    public Cliente(){
    }

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