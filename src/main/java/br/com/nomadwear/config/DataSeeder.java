package br.com.nomadwear.config;

import br.com.nomadwear.entities.Produto;
import br.com.nomadwear.entities.VariacaoProduto;
import br.com.nomadwear.entities.enums.CategoriaProduto;
import br.com.nomadwear.entities.enums.CorProduto;
import br.com.nomadwear.entities.enums.TamanhoProduto;
import br.com.nomadwear.repository.ProdutoRepository;
import br.com.nomadwear.repository.VariacaoProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner popularBancoDeDados(ProdutoRepository produtoRepository,
                                                 VariacaoProdutoRepository variacaoRepository,
                                                 br.com.nomadwear.repository.CupomRepository cupomRepository) {
        return args -> {
            // Verifica se o banco já tem produtos para não duplicar toda vez que reiniciar a API
            if (produtoRepository.count() == 0) {
                System.out.println("🌱 Semeando o banco de dados com produtos iniciais...");

                // 1. Criar o Produto Pai (A vitrine)
                Produto camiseta = new Produto();
                camiseta.setNome("Camiseta Nomad Classic");
                camiseta.setDescricao("Camiseta 100% algodão, perfeita para o dia a dia.");
                camiseta.setCategoria(CategoriaProduto.CAMISETA);
                camiseta.setMarca("Nomad Wear");
                camiseta.setValorCusto(new BigDecimal("30.00"));
                camiseta.setPercentualPrecificacao(new BigDecimal("1.50")); // Lucro de 150% (Ex: Vende por 75.00)
                camiseta.setAtivo(true);

                // Salva o produto pai primeiro
                produtoRepository.save(camiseta);

                // 2. Criar as Variações (Os SKUs reais que vão para o carrinho)
                VariacaoProduto var1 = new VariacaoProduto();
                var1.setProduto(camiseta);
                var1.setSku("NW-CAM-CLASSIC-M-PRETO");
                var1.setTamanho(TamanhoProduto.M);
                var1.setCor(CorProduto.PRETO);
                var1.setQuantidadeEstoque(50);
                var1.setAtiva(true);

                VariacaoProduto var2 = new VariacaoProduto();
                var2.setProduto(camiseta);
                var2.setSku("NW-CAM-CLASSIC-G-BRANCO");
                var2.setTamanho(TamanhoProduto.G);
                var2.setCor(CorProduto.BRANCO);
                var2.setQuantidadeEstoque(20);
                var2.setAtiva(true);

                // Salva as variações
                variacaoRepository.saveAll(Arrays.asList(var1, var2));

                // 3. Criar um Cupão de Teste
                if (cupomRepository.count() == 0) {
                    br.com.nomadwear.entities.Cupom cupomBemVindo = new br.com.nomadwear.entities.Cupom();
                    cupomBemVindo.setCodigo("BEMVINDO10");
                    cupomBemVindo.setValorDesconto(new BigDecimal("15.00")); // Dá R$ 15,00 de desconto
                    cupomBemVindo.setAtivo(true);
                    cupomBemVindo.setTipo(br.com.nomadwear.entities.enums.TipoCupom.PROMOCIONAL);

                    cupomRepository.save(cupomBemVindo);
                    System.out.println("🎟️ Cupom BEMVINDO10 criado (Desconto R$ 15,00)");
                }

                System.out.println("✅ Produtos inseridos com sucesso!");
            }
        };
    }
}