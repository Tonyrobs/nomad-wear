package br.com.nomadwear.repository;

import br.com.nomadwear.entities.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EnderecoRepository extends JpaRepository<Endereco, UUID> {
    List<Endereco> findByClienteId(UUID clienteId); // 👈 novo método
}