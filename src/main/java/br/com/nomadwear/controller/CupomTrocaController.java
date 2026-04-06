package br.com.nomadwear.controller;

import br.com.nomadwear.entities.CupomTroca;
import br.com.nomadwear.repository.CupomTrocaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cupons-troca")
public class CupomTrocaController {

    @Autowired
    private CupomTrocaRepository repository;

    @PostMapping
    public ResponseEntity<CupomTroca> criar(@RequestBody CupomTroca cupom) {
        return ResponseEntity.ok(repository.save(cupom));
    }
}