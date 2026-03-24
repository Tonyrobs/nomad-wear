package br.com.nomadwear.service;

import br.com.nomadwear.entities.Cliente;
import br.com.nomadwear.entities.Telefone;
import br.com.nomadwear.repository.TelefoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TelefoneService {

    private final TelefoneRepository telefoneRepository;
    private final ClienteService clienteService;

    public TelefoneService(TelefoneRepository telefoneRepository, ClienteService clienteService) {
        this.telefoneRepository = telefoneRepository;
        this.clienteService = clienteService;
    }

    @Transactional
    public Telefone criar(UUID clienteId, Telefone telefone) {
        Cliente cliente = clienteService.buscarPorId(clienteId);
        telefone.setCliente(cliente); // 👈 associa o cliente
        validarTelefone(telefone);
        return telefoneRepository.save(telefone);
    }

    public List<Telefone> listarPorCliente(UUID clienteId) {
        return telefoneRepository.findByClienteId(clienteId); // 👈 filtra pelo cliente
    }

    public Telefone buscarPorId(UUID id) {
        return telefoneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Telefone não encontrado com ID: " + id));
    }

    @Transactional
    public Telefone atualizar(UUID id, Telefone telefoneAtualizado) {
        Telefone telefone = buscarPorId(id);
        validarTelefone(telefoneAtualizado);
        telefone.setDdd(telefoneAtualizado.getDdd());
        telefone.setNumero(telefoneAtualizado.getNumero());
        return telefoneRepository.save(telefone);
    }

    @Transactional
    public void deletar(UUID id) {
        if (!telefoneRepository.existsById(id)) {
            throw new IllegalArgumentException("Telefone não encontrado com ID: " + id);
        }
        telefoneRepository.deleteById(id);
    }

    private void validarTelefone(Telefone telefone) {
        if (telefone.getDdd() == null || telefone.getDdd().isBlank())
            throw new IllegalArgumentException("DDD é obrigatório");
        if (telefone.getNumero() == null || telefone.getNumero().isBlank())
            throw new IllegalArgumentException("Número é obrigatório");
    }
}