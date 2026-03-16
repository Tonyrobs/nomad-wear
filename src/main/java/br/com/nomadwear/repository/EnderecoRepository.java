package br.com.nomadwear.repository;

import br.com.nomadwear.entities.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface EnderecoRepository extends JpaRepository<Endereco, UUID> {
}