package br.com.nomadwear.controller;

import br.com.nomadwear.entities.Telefone;
import br.com.nomadwear.service.TelefoneService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clientes/{clienteId}/telefones")
public class TelefoneController {

    private final TelefoneService telefoneService;

    public TelefoneController(TelefoneService telefoneService) {
        this.telefoneService = telefoneService;
    }

    @PostMapping
    public ResponseEntity<Telefone> criar(
            @PathVariable UUID clienteId,
            @Valid @RequestBody Telefone telefone) {
        return ResponseEntity.ok(telefoneService.criar(clienteId, telefone));
    }

    @GetMapping
    public ResponseEntity<List<Telefone>> listar(@PathVariable UUID clienteId) {
        return ResponseEntity.ok(telefoneService.listarPorCliente(clienteId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Telefone> atualizar(
            @PathVariable UUID clienteId,
            @PathVariable UUID id,
            @Valid @RequestBody Telefone telefoneAtualizado) {
        return ResponseEntity.ok(telefoneService.atualizar(id, telefoneAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable UUID clienteId,
            @PathVariable UUID id) {
        telefoneService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}