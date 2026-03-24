package br.com.nomadwear.service;

import java.util.List;
import java.util.UUID;

import br.com.nomadwear.dto.ClienteAtualizarDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.nomadwear.entities.Cliente;
import br.com.nomadwear.repository.ClienteRepository;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    /**
     * Cadastra um novo cliente com validações de negócio
     */
    @Transactional
    public Cliente cadastrar(Cliente cliente) {
        validarClienteAntesDeAlterar(cliente);
        
        if (clienteRepository.existsByCpf(cliente.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado no sistema");
        }
        
        if (clienteRepository.existsByEmail(cliente.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado no sistema");
        }
        
        cliente.setAtivo(true);
        return clienteRepository.save(cliente);
    }

    /**
     * Lista todos os clientes ativos
     */
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    /**
     * Busca cliente por ID
     */
    public Cliente buscarPorId(UUID id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com ID: " + id));
    }

    /**
     * Atualiza dados do cliente
     */

    @Transactional
    public Cliente atualizar(UUID id, ClienteAtualizarDTO dto) {
        Cliente clienteExistente = buscarPorId(id);

        if (!clienteExistente.getCpf().equals(dto.getCpf()) &&
                clienteRepository.existsByCpf(dto.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado no sistema");
        }

        if (!clienteExistente.getEmail().equals(dto.getEmail()) &&
                clienteRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado no sistema");
        }

        clienteExistente.setNome(dto.getNome());
        clienteExistente.setCpf(dto.getCpf());
        clienteExistente.setEmail(dto.getEmail());
        clienteExistente.setGenero(dto.getGenero());
        clienteExistente.setDataNascimento(dto.getDataNascimento());

        return clienteRepository.save(clienteExistente);
    }

    /**
     * Deleta um cliente (soft delete - marca como inativo)
     */
    @Transactional
    public void deletar(UUID id) {
        Cliente cliente = buscarPorId(id);
        cliente.setAtivo(false);
        clienteRepository.save(cliente);
    }

    /**
     * Ativa um cliente desativado
     */
    @Transactional
    public void ativar(UUID id) {
        Cliente cliente = buscarPorId(id);
        cliente.setAtivo(true);
        clienteRepository.save(cliente);
    }

    /**
     * Valida dados obrigatórios do cliente
     */
    private void validarClienteAntesDeAlterar(Cliente cliente) {
        if (cliente.getNome() == null || cliente.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório");
        }
        
        if (cliente.getCpf() == null || cliente.getCpf().isBlank()) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }
        
        if (cliente.getEmail() == null || cliente.getEmail().isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório");
        }
    }
}
