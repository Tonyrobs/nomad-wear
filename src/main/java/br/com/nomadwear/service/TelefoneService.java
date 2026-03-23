package br.com.nomadwear.service;

import br.com.nomadwear.entities.Telefone;
import br.com.nomadwear.repository.TelefoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TelefoneService {

    private final TelefoneRepository telefoneRepository;

    public TelefoneService(TelefoneRepository telefoneRepository) {
        this.telefoneRepository = telefoneRepository;
    }

    /**
     * Cria um novo telefone
     */
    @Transactional
    public Telefone criar(Telefone telefone) {
        validarTelefone(telefone);
        return telefoneRepository.save(telefone);
    }

    /**
     * Lista todos os telefones
     */
    public List<Telefone> listarTodos() {
        return telefoneRepository.findAll();
    }

    /**
     * Busca telefone por ID
     */
    public Telefone buscarPorId(UUID id) {
        return telefoneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Telefone não encontrado com ID: " + id));
    }

    /**
     * Atualiza um telefone existente
     */
    @Transactional
    public Telefone atualizar(UUID id, Telefone telefoneAtualizado) {
        Telefone telefone = buscarPorId(id);
        validarTelefone(telefoneAtualizado);

        telefone.setDdd(telefoneAtualizado.getDdd());
        telefone.setNumero(telefoneAtualizado.getNumero());

        return telefoneRepository.save(telefone);
    }

    /**
     * Deleta um telefone
     */
    @Transactional
    public void deletar(UUID id) {
        if (!telefoneRepository.existsById(id)) {
            throw new IllegalArgumentException("Telefone não encontrado com ID: " + id);
        }
        telefoneRepository.deleteById(id);
    }

    /**
     * Valida dados obrigatórios do telefone
     */
    private void validarTelefone(Telefone telefone) {
        if (telefone.getDdd() == null || telefone.getDdd().isBlank()) {
            throw new IllegalArgumentException("DDD é obrigatório");
        }

        if (telefone.getNumero() == null || telefone.getNumero().isBlank()) {
            throw new IllegalArgumentException("Número é obrigatório");
        }
    }
}
