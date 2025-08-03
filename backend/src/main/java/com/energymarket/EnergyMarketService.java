package com.energymarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EnableScheduling
@EnableWebSocketMessageBroker
@RestController
@RequestMapping("/api")
public class EnergyMarketService implements WebSocketMessageBrokerConfigurer {

    private final Map<String, Double> prices = new HashMap<>();
    private final Map<String, Double> basePrices = Map.of(
        "ELECTRICITY", 50.0,
        "GAS", 30.0,
        "SOLAR", 20.0,
        "WIND", 25.0
    );

    @PostConstruct
    void init() {
        basePrices.forEach(prices::put);
    }

    // One endpoint to rule them all
    @GetMapping("/energy")
    public Map<String, Object> getEnergyData() {
        return Map.of(
            "prices", getCurrentPrices(),
            "timestamp", Instant.now()
        );
    }

    // Real-time streaming - no complexity, just value
    @Scheduled(fixedDelay = 1000)
    public void streamData() {
        var data = getEnergyData();
        template().convertAndSend("/topic/energy", data);
    }

    private List<Map<String, Object>> getCurrentPrices() {
        return prices.entrySet().stream()
            .map(e -> {
                var type = e.getKey();
                var currentPrice = e.getValue();
                var newPrice = fluctuate(currentPrice, basePrices.get(type));
                prices.put(type, newPrice);
                
                return Map.<String, Object>of(
                    "type", type,
                    "price", newPrice,
                    "change", ((newPrice - currentPrice) / currentPrice) * 100
                );
            })
            .toList();
    }

    private double fluctuate(double current, double base) {
        var random = ThreadLocalRandom.current();
        var change = random.nextGaussian() * 0.02;
        var newPrice = current * (1 + change);
        
        // Elegant reversion to mean
        if (Math.abs(newPrice - base) > base * 0.2) {
            newPrice += (base - newPrice) * 0.1;
        }
        
        return Math.max(newPrice, base * 0.5);
    }

    // WebSocket configuration - minimal, focused
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS();
    }

    // CORS - simple, permissive for development
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*");
            }
        };
    }

    // Spring magic - hidden from view
    @Service
    static class MessageService {
        private static SimpMessagingTemplate messagingTemplate;
        
        public MessageService(SimpMessagingTemplate template) {
            messagingTemplate = template;
        }
    }

    private SimpMessagingTemplate template() {
        return MessageService.messagingTemplate;
    }

    public static void main(String[] args) {
        SpringApplication.run(EnergyMarketService.class, args);
    }
}