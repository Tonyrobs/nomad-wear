package br.com.nomadwear.repository;

import br.com.nomadwear.entities.VariacaoProduto;
import br.com.nomadwear.entities.enums.CorProduto;
import br.com.nomadwear.entities.enums.TamanhoProduto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VariacaoProdutoRepository extends JpaRepository<VariacaoProduto, UUID> {

    Optional<VariacaoProduto> findBySku(String sku);

    boolean existsBySku(String sku);

    List<VariacaoProduto> findByProdutoId(UUID produtoId);

    List<VariacaoProduto> findByProdutoIdAndAtivaTrue(UUID produtoId);

    // Busca variação específica por produto + tamanho + cor
    Optional<VariacaoProduto> findByProdutoIdAndTamanhoAndCor(
            UUID produtoId,
            TamanhoProduto tamanho,
            CorProduto cor
    );
}