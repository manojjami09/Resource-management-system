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

@Service
public class InsightsService {

    @Value("${app.gemini.api-key}")
    private String geminiApiKey;

    @Autowired
    private DashboardService dashboardService;

    private final WebClient webClient;

    public InsightsService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
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
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", promptText);
        content.put("parts", new Object[]{part});
        requestBody.put("contents", new Object[]{content});

        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            return "Gemini API Key is not configured. AI insights are currently disabled.";
        }

        try {
            Map response = webClient.post()
                    .uri("/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            // Extract the text safely
            if (response != null && response.containsKey("candidates")) {
                List candidates = (List) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map contentObj = (Map) firstCandidate.get("content");
                    List parts = (List) contentObj.get("parts");
                    if (!parts.isEmpty()) {
                        Map firstPart = (Map) parts.get(0);
                        return (String) firstPart.get("text");
                    }
                }
            }
            return "Unable to generate insights at this moment.";
        } catch (Exception e) {
            return "Error generating insights: " + e.getMessage();
        }
    }
}
