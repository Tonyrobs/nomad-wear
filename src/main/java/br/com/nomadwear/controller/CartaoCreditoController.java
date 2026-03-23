package br.com.nomadwear.controller;

import br.com.nomadwear.entities.CartaoCredito;
import br.com.nomadwear.service.CartaoCreditoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/cartoes")
public class CartaoCreditoController {

    private final CartaoCreditoService cartaoCreditoService;

    public CartaoCreditoController(CartaoCreditoService cartaoCreditoService) {
        this.cartaoCreditoService = cartaoCreditoService;
    }

    @PostMapping
    public ResponseEntity<CartaoCredito> criar(@Valid @RequestBody CartaoCredito cartao) {
        CartaoCredito novo = cartaoCreditoService.criar(cartao);
        return ResponseEntity.ok(novo);
    }

    @GetMapping
    public ResponseEntity<List<CartaoCredito>> listarTodos() {
        return ResponseEntity.ok(cartaoCreditoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartaoCredito> buscarPorId(@PathVariable UUID id) {
        CartaoCredito cartao = cartaoCreditoService.buscarPorId(id);
        return ResponseEntity.ok(cartao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartaoCredito> atualizar(@PathVariable UUID id, @Valid @RequestBody CartaoCredito cartaoAtualizado) {
        CartaoCredito atualizado = cartaoCreditoService.atualizar(id, cartaoAtualizado);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        cartaoCreditoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
