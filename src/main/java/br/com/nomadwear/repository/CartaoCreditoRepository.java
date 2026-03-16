package br.com.nomadwear.repository;

import br.com.nomadwear.entities.CartaoCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CartaoCreditoRepository extends JpaRepository<CartaoCredito, UUID> {
}