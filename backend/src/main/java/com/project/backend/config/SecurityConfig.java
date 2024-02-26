package com.project.backend.config;

import java.util.List;
import com.project.backend.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Autowired
  private JwtUtil jwtUtil;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .cors(Customizer.withDefaults())
      .csrf((csrf) -> csrf.disable())
      .sessionManagement((session) -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
      .authorizeHttpRequests((auth) -> auth
        .requestMatchers("/api/users/register", "/login").permitAll()
        .anyRequest().authenticated()
      )
      .addFilterBefore(new JwtAuthorizationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);
    http
      .formLogin(form -> form
        .loginPage("/login")
        .permitAll()
      )
      .logout((logout) -> logout
        .logoutSuccessUrl("/logout")
        .permitAll()
      );

    return http.build();
  }

  // Configure CORS
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:3000")); // React frontend
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  // Password encoder
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

// Expose AuthenticationManager as a Bean to be used in the AuthService for authenticating users
@Bean
public AuthenticationManager authenticationManagerBean(HttpSecurity http) throws Exception {
    return http.getSharedObject(AuthenticationManager.class);
  }
}
