package br.com.nomadwear.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Libera o CORS (Avisa que as regras do seu CorsConfig são válidas)
                .cors(Customizer.withDefaults())

                // 2. Desliga a proteção CSRF (Essencial para APIs REST não bloquearem os POSTs)
                .csrf(csrf -> csrf.disable())

                // 3. Libera TODAS as rotas sem pedir senha (ideal para a fase de testes)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}