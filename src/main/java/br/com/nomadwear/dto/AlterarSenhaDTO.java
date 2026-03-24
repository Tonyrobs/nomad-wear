package br.com.nomadwear.dto;

public record AlterarSenhaDTO(
        String senhaAtual,
        String novaSenha
) {
}