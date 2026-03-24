package br.com.nomadwear.controller;

import br.com.nomadwear.entities.Endereco;
import br.com.nomadwear.service.EnderecoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clientes/{clienteId}/enderecos")
public class EnderecoController {

    private final EnderecoService enderecoService;

    public EnderecoController(EnderecoService enderecoService) {
        this.enderecoService = enderecoService;
    }

    @PostMapping
    public ResponseEntity<Endereco> criar(
            @PathVariable UUID clienteId,
            @Valid @RequestBody Endereco endereco) {
        return ResponseEntity.ok(enderecoService.criar(clienteId, endereco));
    }

    @GetMapping
    public ResponseEntity<List<Endereco>> listar(@PathVariable UUID clienteId) {
        return ResponseEntity.ok(enderecoService.listarPorCliente(clienteId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Endereco> atualizar(
            @PathVariable UUID clienteId,
            @PathVariable UUID id,
            @Valid @RequestBody Endereco enderecoAtualizado) {
        return ResponseEntity.ok(enderecoService.atualizar(id, enderecoAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable UUID clienteId,
            @PathVariable UUID id) {
        enderecoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}