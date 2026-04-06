package br.com.nomadwear.controller;

import br.com.nomadwear.entities.CartaoCredito;
import br.com.nomadwear.service.CartaoCreditoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clientes/{clienteId}/cartoes")
public class CartaoCreditoController {

    private final CartaoCreditoService cartaoCreditoService;

    public CartaoCreditoController(CartaoCreditoService cartaoCreditoService) {
        this.cartaoCreditoService = cartaoCreditoService;
    }

    @PostMapping
    public ResponseEntity<CartaoCredito> criar(
            @PathVariable UUID clienteId,
            @Valid @RequestBody CartaoCredito cartao) {
        return ResponseEntity.ok(cartaoCreditoService.criar(clienteId, cartao));
    }

    @GetMapping
    public ResponseEntity<List<CartaoCredito>> listar(@PathVariable UUID clienteId) {
        return ResponseEntity.ok(cartaoCreditoService.listarPorCliente(clienteId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartaoCredito> atualizar(
            @PathVariable UUID clienteId,
            @PathVariable UUID id,
            @Valid @RequestBody CartaoCredito cartaoAtualizado) {
        return ResponseEntity.ok(cartaoCreditoService.atualizar(id, cartaoAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable UUID clienteId,
            @PathVariable UUID id) {
        cartaoCreditoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}