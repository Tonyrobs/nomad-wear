package br.com.nomadwear.repository;

import br.com.nomadwear.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    List<Produto> findByAtivoTrue();

    List<Produto> findByNomeContainingIgnoreCase(String nome);

    // RF0013 — produtos sem estoque em nenhuma variação (candidatos a inativação automática)
    @Query("""
        SELECT p FROM Produto p
        WHERE p.ativo = true
        AND NOT EXISTS (
            SELECT v FROM VariacaoProduto v
            WHERE v.produto = p AND v.quantidadeEstoque > 0
        )
    """)
    List<Produto> findProdutosSemEstoque();

    // Busca por categoria
    @Query("SELECT p FROM Produto p WHERE p.categoria = :categoria AND p.ativo = true")
    List<Produto> findByCategoriaAndAtivoTrue(@Param("categoria") br.com.nomadwear.entities.enums.CategoriaProduto categoria);
}