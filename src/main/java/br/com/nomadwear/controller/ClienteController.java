package br.com.nomadwear.controller;

import br.com.nomadwear.entities.Cliente;
import br.com.nomadwear.repository.ClienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Cliente cliente) {

        if (clienteRepository.existsByCpf(cliente.getCpf())) {
            return ResponseEntity.badRequest().body("CPF já cadastrado!");
        }

        if (clienteRepository.existsByEmail(cliente.getEmail())) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado!");
        }

        cliente.setAtivo(true);
        Cliente salvo = clienteRepository.save(cliente);
        return ResponseEntity.ok(salvo);
    }

    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public Cliente buscarPorId(@PathVariable UUID id) {
        return clienteRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable UUID id) {
        clienteRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Cliente atualizar(@PathVariable java.util.UUID id, @RequestBody Cliente clienteAtualizado) {

        Cliente clienteExistente = clienteRepository.findById(id).orElse(null);

        if (clienteExistente != null) {
            clienteExistente.setNome(clienteAtualizado.getNome());
            clienteExistente.setCpf(clienteAtualizado.getCpf());
            clienteExistente.setEmail(clienteAtualizado.getEmail());
            clienteExistente.setSenha(clienteAtualizado.getSenha());

            return clienteRepository.save(clienteExistente);
        }

        return null;
    }
}