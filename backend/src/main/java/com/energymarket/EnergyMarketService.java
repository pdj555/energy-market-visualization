package com.energymarket;

import com.sun.net.httpserver.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.util.*;
import java.util.concurrent.*;

public class EnergyMarketService {
    
    private static final Map<String, Market> markets = new ConcurrentHashMap<>();
    private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    static {
        // Initialize with purposeful values - not random noise
        markets.put("SOLAR", new Market(20.0, 0.15, true));  // Cheapest, most volatile, future
        markets.put("WIND", new Market(25.0, 0.10, true));   // Cheap, stable, future
        markets.put("GAS", new Market(30.0, 0.08, false));   // Expensive, volatile, past
        markets.put("COAL", new Market(40.0, 0.05, false));  // Most expensive, dying
    }
    
    public static void main(String[] args) throws Exception {
        // Simple HTTP server - no framework needed
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // API endpoint
        server.createContext("/api/energy", exchange -> {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            
            String response = toJson();
            exchange.sendResponseHeaders(200, response.length());
            exchange.getResponseBody().write(response.getBytes());
            exchange.close();
        });
        
        // WebSocket endpoint (SSE fallback for simplicity)
        server.createContext("/stream", exchange -> {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Content-Type", "text/event-stream");
            exchange.getResponseHeaders().add("Cache-Control", "no-cache");
            exchange.sendResponseHeaders(200, 0);
            
            OutputStream out = exchange.getResponseBody();
            
            // Stream updates every second
            ScheduledFuture<?> streamer = scheduler.scheduleAtFixedRate(() -> {
                try {
                    out.write(("data: " + toJson() + "\n\n").getBytes());
                    out.flush();
                } catch (IOException e) {
                    // Client disconnected
                }
            }, 0, 1, TimeUnit.SECONDS);
            
            // Cleanup on disconnect
            exchange.getHttpContext().getServer().removeContext(exchange.getHttpContext());
        });
        
        // Start evolution
        scheduler.scheduleAtFixedRate(EnergyMarketService::evolve, 0, 1, TimeUnit.SECONDS);
        
        server.start();
        System.out.println("Energy market running at http://localhost:8080");
    }
    
    private static void evolve() {
        markets.forEach((type, market) -> {
            double trend = market.isFuture ? 0.001 : -0.001; // Future energy gets cheaper
            double noise = (Math.random() - 0.5) * market.volatility;
            double change = trend + noise;
            
            market.price *= (1 + change);
            market.change = change * 100;
            
            // Reality constraints
            market.price = Math.max(market.price, 5.0);  // Nothing is free
            market.price = Math.min(market.price, 100.0); // Nothing is astronomical
        });
    }
    
    private static String toJson() {
        StringBuilder json = new StringBuilder("{\"prices\":[");
        
        markets.entrySet().stream()
            .sorted((a, b) -> Double.compare(a.getValue().price, b.getValue().price))
            .forEach(entry -> {
                Market m = entry.getValue();
                json.append(String.format(
                    "{\"type\":\"%s\",\"price\":%.2f,\"change\":%.2f,\"future\":%b},",
                    entry.getKey(), m.price, m.change, m.isFuture
                ));
            });
        
        json.setLength(json.length() - 1); // Remove trailing comma
        json.append("],\"timestamp\":").append(System.currentTimeMillis()).append("}");
        
        return json.toString();
    }
    
    static class Market {
        double price;
        double volatility;
        double change;
        boolean isFuture;
        
        Market(double price, double volatility, boolean isFuture) {
            this.price = price;
            this.volatility = volatility;
            this.isFuture = isFuture;
            this.change = 0;
        }
    }
}