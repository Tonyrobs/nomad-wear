package br.com.nomadwear.service;

import br.com.nomadwear.dto.ItemPedidoDTO;
import br.com.nomadwear.dto.PagamentoCartaoDTO;
import br.com.nomadwear.dto.PedidoRequestDTO;
import br.com.nomadwear.entities.*;
import br.com.nomadwear.entities.enums.StatusPedido;
import br.com.nomadwear.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final EnderecoRepository enderecoRepository;
    private final VariacaoProdutoRepository variacaoRepository;
    private final CupomRepository cupomRepository;
    private final CartaoCreditoRepository cartaoRepository;

    // Injeção de dependências via construtor
    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository,
                         EnderecoRepository enderecoRepository, VariacaoProdutoRepository variacaoRepository,
                         CupomRepository cupomRepository, CartaoCreditoRepository cartaoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.enderecoRepository = enderecoRepository;
        this.variacaoRepository = variacaoRepository;
        this.cupomRepository = cupomRepository;
        this.cartaoRepository = cartaoRepository;
    }

    @Transactional
    public Pedido realizarCompra(PedidoRequestDTO dto) {
        // 1. Buscar Cliente e Endereço
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));

        Endereco endereco = enderecoRepository.findById(dto.getEnderecoId())
                .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado."));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setEnderecoEntrega(endereco);
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setStatus(StatusPedido.EM_PROCESSAMENTO);
        pedido.setValorFrete(dto.getValorFrete());

        // 2. Processar Itens, Subtotal e abater o Stock
        BigDecimal subtotal = BigDecimal.ZERO;

        for (ItemPedidoDTO itemDto : dto.getItens()) {
            VariacaoProduto variacao = variacaoRepository.findById(itemDto.getVariacaoProdutoId())
                    .orElseThrow(() -> new IllegalArgumentException("SKU não encontrado."));

            // O seu método fantástico de baixar o stock que criámos antes!
            variacao.darBaixa(itemDto.getQuantidade());

            // Calcula o preço do item (quantidade * valor unitário do produto pai)
            BigDecimal precoUnitario = variacao.getProduto().getValorVenda();
            BigDecimal totalItem = precoUnitario.multiply(new BigDecimal(itemDto.getQuantidade()));
            subtotal = subtotal.add(totalItem);

            ItemPedido itemPedido = new ItemPedido(pedido, variacao, itemDto.getQuantidade(), precoUnitario);
            pedido.getItens().add(itemPedido);
        }
        pedido.setSubtotal(subtotal);

        // 3. Aplicar Cupom (se existir)
        BigDecimal valorDesconto = BigDecimal.ZERO;
        if (dto.getCupomCodigo() != null && !dto.getCupomCodigo().isBlank()) {
            Cupom cupom = cupomRepository.findByCodigo(dto.getCupomCodigo())
                    .orElseThrow(() -> new IllegalArgumentException("Cupão inválido."));

            if (!cupom.getAtivo()) {
                throw new IllegalArgumentException("Este cupão já não está ativo.");
            }
            pedido.setCupom(cupom);
            valorDesconto = cupom.getValorDesconto();
        }

        // 4. Calcular Valor Total Final (Subtotal + Frete - Desconto)
        BigDecimal valorTotal = subtotal.add(dto.getValorFrete()).subtract(valorDesconto);
        // Garantir que o valor não fica negativo
        if (valorTotal.compareTo(BigDecimal.ZERO) < 0) valorTotal = BigDecimal.ZERO;
        pedido.setValorTotal(valorTotal);

        // 5. Validar Pagamentos
        // Verifica a forma de pagamento que chegou do Frontend
        if (dto.getTipoPagamento() == br.com.nomadwear.entities.enums.TipoPagamento.CARTAO) {

            BigDecimal somaPagamentos = BigDecimal.ZERO;
            for (PagamentoCartaoDTO pagDto : dto.getPagamentos()) {
                CartaoCredito cartao = cartaoRepository.findById(pagDto.getCartaoId())
                        .orElseThrow(() -> new IllegalArgumentException("Cartão não encontrado."));

                PagamentoPedido pagamento = new PagamentoPedido(pedido, cartao, pagDto.getValorCobrado());
                pedido.getPagamentos().add(pagamento);

                somaPagamentos = somaPagamentos.add(pagDto.getValorCobrado());
            }

            // REGRA DE NEGÓCIO CRÍTICA DO CARTÃO
            if (somaPagamentos.compareTo(valorTotal) != 0) {
                throw new IllegalArgumentException("A soma dos valores nos cartões não confere com o total do pedido. Total exigido: " + valorTotal);
            }

            // Cartão aprova automaticamente na hora da compra
            pedido.setStatus(StatusPedido.PAGAMENTO_APROVADO);

        } else if (dto.getTipoPagamento() == br.com.nomadwear.entities.enums.TipoPagamento.PIX) {

            pedido.setStatus(StatusPedido.EM_PROCESSAMENTO);

            System.out.println("Gerando cobrança PIX para o pedido...");
        }

        // 6. Guardar na Base de Dados
        return pedidoRepository.save(pedido);

    }
    public List<Pedido> listarPorCliente(UUID clienteId) {
        return pedidoRepository.findByClienteIdOrderByDataPedidoDesc(clienteId);
    }

}