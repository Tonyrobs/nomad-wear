package br.com.nomadwear.repository;

import br.com.nomadwear.entities.CupomTroca;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CupomTrocaRepository extends JpaRepository<CupomTroca, UUID> {
    Optional<CupomTroca> findByCodigo(String codigo);
}