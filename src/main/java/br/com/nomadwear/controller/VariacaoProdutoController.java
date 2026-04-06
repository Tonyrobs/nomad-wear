package br.com.nomadwear.controller;

import br.com.nomadwear.entities.VariacaoProduto;
import br.com.nomadwear.repository.VariacaoProdutoRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/variacoes")
@CrossOrigin(origins = "*") // Libera o seu HTML para acessar esta rota
public class VariacaoProdutoController {

    private final VariacaoProdutoRepository repository;

    public VariacaoProdutoController(VariacaoProdutoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<VariacaoProduto> listarTodas() {
        // Vai no banco e devolve todos os SKUs com seus estoques reais!
        return repository.findAll();
    }
}