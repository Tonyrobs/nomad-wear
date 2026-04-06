package br.com.nomadwear.service;

import br.com.nomadwear.entities.CartaoCredito;
import br.com.nomadwear.entities.Cliente;
import br.com.nomadwear.repository.CartaoCreditoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class CartaoCreditoService {

    private final CartaoCreditoRepository cartaoCreditoRepository;
    private final ClienteService clienteService;

    public CartaoCreditoService(CartaoCreditoRepository cartaoCreditoRepository, ClienteService clienteService) {
        this.cartaoCreditoRepository = cartaoCreditoRepository;
        this.clienteService = clienteService;
    }

    @Transactional
    public CartaoCredito criar(UUID clienteId, CartaoCredito cartao) {
        Cliente cliente = clienteService.buscarPorId(clienteId);
        cartao.setCliente(cliente); // 👈 associa o cliente
        validarCartao(cartao);
        return cartaoCreditoRepository.save(cartao);
    }

    public List<CartaoCredito> listarPorCliente(UUID clienteId) {
        return cartaoCreditoRepository.findByClienteId(clienteId); // 👈 filtra pelo cliente
    }

    public CartaoCredito buscarPorId(UUID id) {
        return cartaoCreditoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cartão não encontrado com ID: " + id));
    }

    @Transactional
    public CartaoCredito atualizar(UUID id, CartaoCredito cartaoAtualizado) {
        CartaoCredito cartao = buscarPorId(id);
        validarCartao(cartaoAtualizado);
        cartao.setNumeroCartao(cartaoAtualizado.getNumeroCartao());
        cartao.setNomeTitular(cartaoAtualizado.getNomeTitular());
        cartao.setDataValidade(cartaoAtualizado.getDataValidade());
        cartao.setCodigoSeguranca(cartaoAtualizado.getCodigoSeguranca());
        cartao.setBandeira(cartaoAtualizado.getBandeira());
        return cartaoCreditoRepository.save(cartao);
    }

    @Transactional
    public void deletar(UUID id) {
        if (!cartaoCreditoRepository.existsById(id)) {
            throw new IllegalArgumentException("Cartão não encontrado com ID: " + id);
        }
        cartaoCreditoRepository.deleteById(id);
    }

    private void validarCartao(CartaoCredito cartao) {
        if (cartao.getNumeroCartao() == null || cartao.getNumeroCartao().isBlank())
            throw new IllegalArgumentException("Número do cartão é obrigatório");
        if (cartao.getNomeTitular() == null || cartao.getNomeTitular().isBlank())
            throw new IllegalArgumentException("Nome do titular é obrigatório");
        if (cartao.getDataValidade() == null)
            throw new IllegalArgumentException("Data de validade é obrigatória");
        if (cartao.getCodigoSeguranca() == null || cartao.getCodigoSeguranca().isBlank())
            throw new IllegalArgumentException("Código de segurança é obrigatório");
        if (cartao.getBandeira() == null)
            throw new IllegalArgumentException("Bandeira é obrigatória");
    }
}