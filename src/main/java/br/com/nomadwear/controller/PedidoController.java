package br.com.nomadwear.controller;

import br.com.nomadwear.dto.ItemPedidoResponseDTO;
import br.com.nomadwear.dto.PedidoRequestDTO;
import br.com.nomadwear.dto.PedidoResponseDTO;
import br.com.nomadwear.entities.Pedido;
import br.com.nomadwear.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> finalizarCompra(@RequestBody @Valid PedidoRequestDTO dto) {
        Pedido pedidoSalvo = pedidoService.realizarCompra(dto);

        PedidoResponseDTO response = new PedidoResponseDTO(
                pedidoSalvo.getId(),
                pedidoSalvo.getStatus().getDescricao(),
                pedidoSalvo.getValorTotal(),
                pedidoSalvo.getDataPedido(),
                List.of()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoResponseDTO>> listarPorCliente(@PathVariable UUID clienteId) {
        List<Pedido> pedidos = pedidoService.listarPorCliente(clienteId);

        List<PedidoResponseDTO> response = pedidos.stream().map(p -> {
            List<ItemPedidoResponseDTO> itens = p.getItens().stream().map(item ->
                    new ItemPedidoResponseDTO(
                            item.getVariacaoProduto().getProduto().getNome(),
                            item.getVariacaoProduto().getSku(),
                            item.getQuantidade(),
                            item.getPrecoUnitario()
                    )
            ).toList();

            return new PedidoResponseDTO(
                    p.getId(),
                    p.getStatus().getDescricao(),
                    p.getValorTotal(),
                    p.getDataPedido(),
                    itens
            );
        }).toList();

        return ResponseEntity.ok(response);
    }
}