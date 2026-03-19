package br.com.nomadwear.controller;

import br.com.nomadwear.entities.Cliente;
import br.com.nomadwear.repository.ClienteRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @PostMapping
    public Cliente cadastrar(@RequestBody Cliente cliente) {
        cliente.setAtivo(true);
        return clienteRepository.save(cliente);
    }
}