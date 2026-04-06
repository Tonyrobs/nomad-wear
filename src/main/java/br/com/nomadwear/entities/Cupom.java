package br.com.nomadwear.entities;

import br.com.nomadwear.entities.enums.TipoCupom;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "tb_cupom")
public class Cupom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String codigo;

    private BigDecimal valorDesconto;
    private Boolean ativo;

    @Enumerated(EnumType.STRING)
    private TipoCupom tipo;

    // Construtor vazio (obrigatório para o JPA)
    public Cupom() {}

    public Cupom(String codigo, BigDecimal valorDesconto, Boolean ativo, TipoCupom tipo) {
        this.codigo = codigo;
        this.valorDesconto = valorDesconto;
        this.ativo = ativo;
        this.tipo = tipo;
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public BigDecimal getValorDesconto() { return valorDesconto; }
    public void setValorDesconto(BigDecimal valorDesconto) { this.valorDesconto = valorDesconto; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public TipoCupom getTipo() { return tipo; }
    public void setTipo(TipoCupom tipo) { this.tipo = tipo; }
}