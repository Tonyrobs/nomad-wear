package br.com.nomadwear.controller;

import br.com.nomadwear.entities.Telefone;
import br.com.nomadwear.service.TelefoneService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/telefones")
public class TelefoneController {

    private final TelefoneService telefoneService;

    public TelefoneController(TelefoneService telefoneService) {
        this.telefoneService = telefoneService;
    }

    @PostMapping
    public ResponseEntity<Telefone> criar(@Valid @RequestBody Telefone telefone) {
        Telefone novo = telefoneService.criar(telefone);
        return ResponseEntity.ok(novo);
    }

    @GetMapping
    public ResponseEntity<List<Telefone>> listarTodos() {
        return ResponseEntity.ok(telefoneService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Telefone> buscarPorId(@PathVariable UUID id) {
        Telefone telefone = telefoneService.buscarPorId(id);
        return ResponseEntity.ok(telefone);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Telefone> atualizar(@PathVariable UUID id, @Valid @RequestBody Telefone telefoneAtualizado) {
        Telefone atualizado = telefoneService.atualizar(id, telefoneAtualizado);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        telefoneService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
