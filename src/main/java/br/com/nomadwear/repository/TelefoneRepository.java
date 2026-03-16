package br.com.nomadwear.repository;

import br.com.nomadwear.entities.Telefone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TelefoneRepository extends JpaRepository<Telefone, UUID> {
}