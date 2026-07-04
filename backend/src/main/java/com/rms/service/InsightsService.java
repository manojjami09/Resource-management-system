package com.rms.service;

import com.rms.dto.DashboardStatsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
public class InsightsService {

    @Value("${app.groq.api-key}")
    private String groqApiKey;

    @Autowired
    private DashboardService dashboardService;

    private final WebClient webClient;

    public InsightsService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.groq.com").build();
    }

    @Cacheable("managerSummary")
    public String getManagerSummary() {
        DashboardStatsDto stats = dashboardService.getStats();

        String promptText = String.format(
                "You are an AI assistant for a Resource Management app. Based on the following stats: " +
                "Total Employees: %d, Bench Percentage: %.1f%%, Active Projects: %d, Average Utilization: %.1f%%. " +
                "Provide a 2-3 sentence summary for a manager highlighting key insights and areas of concern.",
                stats.getTotalEmployees(), stats.getBenchPercent(), stats.getActiveProjects(), stats.getAvgUtilization()
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama-3.1-8b-instant");
        
        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "You are an AI assistant for a resource management system. Provide concise, actionable insights for managers.");
        
        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", promptText);
        
        requestBody.put("messages", new Object[]{systemMessage, userMessage});
        requestBody.put("max_tokens", 256);
        requestBody.put("temperature", 0.7);
        
        try {
            String jsonBody = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(requestBody);
            System.out.println("DEBUG Groq Request Body: " + jsonBody);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (groqApiKey == null || groqApiKey.isEmpty() || groqApiKey.equals("mock-key")) {
            return "Groq API Key is not configured. Add it to application.yml to enable AI Manager Insights!";
        }

        try {
            Map response = webClient.post()
                    .uri("/openai/v1/chat/completions")
                    .header("Authorization", "Bearer " + groqApiKey)
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "RMS-Backend/1.0")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            // Extract the text safely
            if (response != null && response.containsKey("choices")) {
                List choices = (List) response.get("choices");
                if (!choices.isEmpty()) {
                    Map firstChoice = (Map) choices.get(0);
                    Map messageObj = (Map) firstChoice.get("message");
                    if (messageObj != null && messageObj.containsKey("content")) {
                        return (String) messageObj.get("content");
                    }
                }
            }
            return "Unable to generate insights at this moment.";
        } catch (WebClientResponseException e) {
            System.err.println("Groq API Error Status: " + e.getStatusCode());
            System.err.println("Groq API Error Body: " + e.getResponseBodyAsString());
            return "AI insights temporarily unavailable";
        } catch (Exception e) {
            System.err.println("Groq API Error: " + e.getMessage());
            return "AI insights temporarily unavailable";
        }
    }
}
