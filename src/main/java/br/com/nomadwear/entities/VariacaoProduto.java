package br.com.nomadwear.entities;

import br.com.nomadwear.entities.enums.CorProduto;
import br.com.nomadwear.entities.enums.TamanhoProduto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * Representa uma variação (SKU) única de um produto.
 * Cada combinação de Tamanho + Cor gera um SKU distinto (RF0017, RNF0021).
 * O estoque é controlado por variação, não pelo produto pai.
 */
@Entity
@Table(
        name = "variacao_produto",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_variacao_produto_tamanho_cor",
                columnNames = {"produto_id", "tamanho", "cor"}
        )
)
public class VariacaoProduto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Código único do SKU no sistema (ex: "NW-CAM-001-M-PRETO") — RNF0021
    @NotBlank(message = "O SKU é obrigatório")
    @Column(unique = true, nullable = false)
    private String sku;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    @JsonBackReference
    private Produto produto;

    @NotNull(message = "O tamanho é obrigatório")
    @Enumerated(EnumType.STRING)
    private TamanhoProduto tamanho;

    @NotNull(message = "A cor é obrigatória")
    @Enumerated(EnumType.STRING)
    private CorProduto cor;

    // Quantidade em estoque desta variação (RF0051)
    @Min(value = 0, message = "O estoque não pode ser negativo")
    private int quantidadeEstoque;

    // Variação ativa/inativa — inativada automaticamente se estoque = 0 (RF0013)
    private boolean ativa;

    public VariacaoProduto() {
    }

    public VariacaoProduto(String sku, Produto produto, TamanhoProduto tamanho,
                           CorProduto cor, int quantidadeEstoque) {
        this.id = UUID.randomUUID();
        this.sku = sku;
        this.produto = produto;
        this.tamanho = tamanho;
        this.cor = cor;
        this.quantidadeEstoque = quantidadeEstoque;
        this.ativa = quantidadeEstoque > 0;
    }

    // Dá baixa no estoque (RF0053) — lança exceção se insuficiente
    public void darBaixa(int quantidade) {
        if (quantidade > this.quantidadeEstoque) {
            throw new IllegalArgumentException(
                    "Estoque insuficiente para SKU " + sku +
                            ". Disponível: " + this.quantidadeEstoque + ", solicitado: " + quantidade
            );
        }
        this.quantidadeEstoque -= quantidade;
        if (this.quantidadeEstoque == 0) {
            this.ativa = false;
        }
    }

    // Reentrada em estoque após troca (RF0054)
    public void reentrarEstoque(int quantidade) {
        this.quantidadeEstoque += quantidade;
        this.ativa = true;
    }

    // Getters e Setters

    public UUID getId() { return id; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public TamanhoProduto getTamanho() { return tamanho; }
    public void setTamanho(TamanhoProduto tamanho) { this.tamanho = tamanho; }

    public CorProduto getCor() { return cor; }
    public void setCor(CorProduto cor) { this.cor = cor; }

    public int getQuantidadeEstoque() { return quantidadeEstoque; }
    public void setQuantidadeEstoque(int quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public boolean isAtiva() { return ativa; }
    public void setAtiva(boolean ativa) { this.ativa = ativa; }
}