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
        markets.put("SOLAR", new Market(20.0, 0.15, true));
        markets.put("WIND", new Market(25.0, 0.10, true));
        markets.put("GAS", new Market(30.0, 0.08, false));
        markets.put("COAL", new Market(40.0, 0.05, false));
    }
    
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.setExecutor(null); // Use default executor
        
        server.createContext("/api/energy", exchange -> {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            
            String response = toJson();
            exchange.sendResponseHeaders(200, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        });
        
        // Start price evolution
        scheduler.scheduleAtFixedRate(EnergyMarketService::evolve, 0, 1, TimeUnit.SECONDS);
        
        server.start();
        System.out.println("Energy market running at http://localhost:8080");
    }
    
    private static void evolve() {
        markets.forEach((type, market) -> {
            double trend = market.isFuture ? -0.001 : 0.001;
            double noise = (Math.random() - 0.5) * market.volatility;
            double change = trend + noise;
            
            market.price *= (1 + change);
            market.change = change * 100;
            
            market.price = Math.max(market.price, 5.0);
            market.price = Math.min(market.price, 100.0);
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
        
        if (json.charAt(json.length() - 1) == ',') {
            json.setLength(json.length() - 1);
        }
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