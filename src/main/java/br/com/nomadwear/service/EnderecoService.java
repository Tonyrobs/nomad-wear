package br.com.nomadwear.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.nomadwear.entities.Cliente;
import br.com.nomadwear.entities.Endereco;
import br.com.nomadwear.repository.EnderecoRepository;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final ClienteService clienteService;

    public EnderecoService(EnderecoRepository enderecoRepository, ClienteService clienteService) {
        this.enderecoRepository = enderecoRepository;
        this.clienteService = clienteService;
    }

    @Transactional
    public Endereco criar(UUID clienteId, Endereco endereco) {
        Cliente cliente = clienteService.buscarPorId(clienteId);
        endereco.setCliente(cliente); // 👈 associa o cliente
        validarEndereco(endereco);
        return enderecoRepository.save(endereco);
    }

    public List<Endereco> listarPorCliente(UUID clienteId) {
        return enderecoRepository.findByClienteId(clienteId); // 👈 filtra pelo cliente
    }

    public Endereco buscarPorId(UUID id) {
        return enderecoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado com ID: " + id));
    }

    @Transactional
    public Endereco atualizar(UUID id, Endereco enderecoAtualizado) {
        Endereco endereco = buscarPorId(id);
        validarEndereco(enderecoAtualizado);
        endereco.setPais(enderecoAtualizado.getPais());
        endereco.setCep(enderecoAtualizado.getCep());
        endereco.setEstado(enderecoAtualizado.getEstado());
        endereco.setCidade(enderecoAtualizado.getCidade());
        endereco.setRua(enderecoAtualizado.getRua());
        endereco.setNumero(enderecoAtualizado.getNumero());
        endereco.setBairro(enderecoAtualizado.getBairro());
        endereco.setComplemento(enderecoAtualizado.getComplemento());
        endereco.setObservacoes(enderecoAtualizado.getObservacoes());
        return enderecoRepository.save(endereco);
    }

    @Transactional
    public void deletar(UUID id) {
        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado"));

        if (endereco.getCliente() != null) {
            endereco.getCliente().getEnderecos().remove(endereco);
        }

        enderecoRepository.delete(endereco);
    }

    private void validarEndereco(Endereco endereco) {
        if (endereco.getPais() == null || endereco.getPais().isBlank())
            throw new IllegalArgumentException("País é obrigatório");
        if (endereco.getCep() == null || endereco.getCep().isBlank())
            throw new IllegalArgumentException("CEP é obrigatório");
        if (endereco.getEstado() == null || endereco.getEstado().isBlank())
            throw new IllegalArgumentException("Estado é obrigatório");
        if (endereco.getCidade() == null || endereco.getCidade().isBlank())
            throw new IllegalArgumentException("Cidade é obrigatória");
        if (endereco.getRua() == null || endereco.getRua().isBlank())
            throw new IllegalArgumentException("Rua é obrigatória");
        if (endereco.getNumero() == null || endereco.getNumero().isBlank())
            throw new IllegalArgumentException("Número é obrigatório");
        if (endereco.getBairro() == null || endereco.getBairro().isBlank())
            throw new IllegalArgumentException("Bairro é obrigatório");
    }
}