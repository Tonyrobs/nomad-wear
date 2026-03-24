package br.com.nomadwear.controller;

import java.util.List;
import java.util.UUID;

import br.com.nomadwear.dto.AlterarSenhaDTO;
import br.com.nomadwear.repository.ClienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.nomadwear.dto.ClienteAtualizarDTO;
import br.com.nomadwear.entities.Cliente;
import br.com.nomadwear.service.ClienteService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final ClienteRepository repository; // Injetando o Repository corretamente

    public ClienteController(ClienteService clienteService, ClienteRepository repository) {
        this.clienteService = clienteService;
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Cliente> cadastrar(@Valid @RequestBody Cliente cliente) {
        Cliente salvo = clienteService.cadastrar(cliente);
        return ResponseEntity.ok(salvo);
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        return ResponseEntity.ok(clienteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable UUID id) {
        Cliente cliente = clienteService.buscarPorId(id);
        return ResponseEntity.ok(cliente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        clienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody ClienteAtualizarDTO dto) {
        Cliente salvo = clienteService.atualizar(id, dto);
        return ResponseEntity.ok(salvo);
    }

    @PutMapping("/{id}/ativar")
    public ResponseEntity<Void> ativar(@PathVariable UUID id) {
        clienteService.ativar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/desativar")
    public ResponseEntity<Void> desativar(@PathVariable UUID id) {
        System.out.println("LOG: Tentando desativar o cliente: " + id);
        clienteService.desativar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/senha")
    public ResponseEntity<?> alterarSenha(@PathVariable UUID id, @RequestBody AlterarSenhaDTO dados) {
        var clienteOptional = repository.findById(id);
        if (clienteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var cliente = clienteOptional.get();

        if (!cliente.getSenha().equals(dados.senhaAtual())) {
            return ResponseEntity.badRequest().body("A senha atual está incorreta.");
        }

        cliente.setSenha(dados.novaSenha());
        repository.save(cliente);

        return ResponseEntity.ok().build();
    }
}