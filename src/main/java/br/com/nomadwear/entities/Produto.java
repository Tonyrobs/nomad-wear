package br.com.nomadwear.entities;

import br.com.nomadwear.entities.enums.CategoriaProduto;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "O nome do produto é obrigatório")
    private String nome;

    private String descricao;

    @Enumerated(EnumType.STRING)
    private CategoriaProduto categoria;
    private String marca;

    // Valor de custo
    @NotNull(message = "O valor de custo é obrigatório")
    @Positive(message = "O valor de custo deve ser positivo")
    @Column(precision = 10, scale = 2)
    private BigDecimal valorCusto;

    // Valor de venda calculado (valorCusto * (1 + percentualPrecificacao))
    @Column(precision = 10, scale = 2)
    private BigDecimal valorVenda;

    @Column(precision = 5, scale = 4)
    private BigDecimal percentualPrecificacao;

    // Produto ativo/inativo (RF0012)
    private boolean ativo;

    // Variações do produto (grade de tamanho × cor) — cada variação é um SKU único (RF0017)
    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<VariacaoProduto> variacoes = new ArrayList<>();

    // URL(s) das fotos — separadas por vírgula ou lista JSON (lazy loading — RNF0014)
    private String fotosUrl;

    public Produto() {
    }

    public Produto(String nome, String descricao, CategoriaProduto categoria, String marca,
                   BigDecimal valorCusto, BigDecimal percentualPrecificacao) {
        this.id = UUID.randomUUID();
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.marca = marca;
        this.valorCusto = valorCusto;
        this.percentualPrecificacao = percentualPrecificacao;
        this.ativo = true;
        calcularValorVenda();
    }

    // Calcula valor de venda com base no custo e no percentual
    public void calcularValorVenda() {
        if (this.valorCusto != null && this.percentualPrecificacao != null) {
            this.valorVenda = this.valorCusto.multiply(
                    BigDecimal.ONE.add(this.percentualPrecificacao)
            ).setScale(2, java.math.RoundingMode.HALF_UP);
        }
    }

    // Getters e Setters

    public UUID getId() { return id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public CategoriaProduto getCategoria() { return categoria; }
    public void setCategoria(CategoriaProduto categoria) { this.categoria = categoria; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public BigDecimal getValorCusto() { return valorCusto; }
    public void setValorCusto(BigDecimal valorCusto) {
        this.valorCusto = valorCusto;
        calcularValorVenda();
    }

    public BigDecimal getValorVenda() { return valorVenda; }

    public BigDecimal getPercentualPrecificacao() { return percentualPrecificacao; }
    public void setPercentualPrecificacao(BigDecimal percentualPrecificacao) {
        this.percentualPrecificacao = percentualPrecificacao;
        calcularValorVenda();
    }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    public List<VariacaoProduto> getVariacoes() { return variacoes; }
    public void setVariacoes(List<VariacaoProduto> variacoes) { this.variacoes = variacoes; }

    public String getFotosUrl() { return fotosUrl; }
    public void setFotosUrl(String fotosUrl) { this.fotosUrl = fotosUrl; }
}