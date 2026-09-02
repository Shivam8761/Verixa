package com.sv.verixa.ai.service;

import com.sv.verixa.ai.dto.AiChatRequest;
import com.sv.verixa.ai.dto.AiChatResponse;
import com.sv.verixa.interview.dto.InterviewEvaluationDto;
import com.sv.verixa.interview.entity.InterviewAnswer;
import com.sv.verixa.question.entity.Question;
import com.sv.verixa.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    private final QuestionRepository questionRepository;

    @Value("${verixa.ai.api-key:}")
    private String apiKey;

    @Value("${verixa.ai.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String baseUrl;

    @Value("${verixa.ai.model:gemini-1.5-flash}")
    private String model;

    public AiChatResponse chat(AiChatRequest request) {
        String questionContext = "";
        if (request.getQuestionId() != null) {
            Optional<Question> q = questionRepository.findById(request.getQuestionId());
            if (q.isPresent()) {
                questionContext = "\nQuestion Context: " + q.get().getTitle() + " - " + q.get().getDescription();
            }
        }

        String prompt = "You are VERIXA AI, an expert software architecture and tech placement interviewer."
                + questionContext
                + "\nUser prompt: " + request.getPrompt();

        if (apiKey != null && !apiKey.isBlank()) {
            try {
                String responseText = callGeminiApi(prompt);
                return AiChatResponse.builder()
                        .responseText(responseText)
                        .actionSuggestion("Practice related questions on Verixa")
                        .build();
            } catch (Exception ex) {
                log.warn("Direct LLM API call failed, falling back to Verixa AI engine: {}", ex.getMessage());
            }
        }

        // Contextual heuristic fallback
        return generateContextualFallback(request, questionContext);
    }

    public Map<String, Object> evaluateAnswerAndFollowUp(String question, String answer) {
        String lowerAns = answer.toLowerCase();
        int commScore = 80;
        int clarityScore = 85;
        int relevanceScore = 80;

        if (answer.length() < 15) {
            commScore = 55;
            clarityScore = 60;
        }

        String followUp = "Thank you. Could you elaborate further on how you handled challenges in your recent projects or teamwork?";
        String feedback = "Good start! Expand with concrete examples using the STAR method (Situation, Task, Action, Result).";

        if (lowerAns.contains("spring") || lowerAns.contains("java") || lowerAns.contains("react") || lowerAns.contains("kafka")) {
            followUp = "You mentioned core technologies in your answer. Why did you choose those specific tools, and how did you verify performance?";
            feedback = "Strong technical reference! Be prepared to discuss architectural trade-offs.";
            commScore = 90;
            relevanceScore = 92;
        } else if (lowerAns.contains("leader") || lowerAns.contains("team") || lowerAns.contains("conflict")) {
            followUp = "How do you handle situation when team members disagree with technical decisions?";
            feedback = "Good interpersonal focus. Highlight conflict resolution and communication.";
            commScore = 88;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("commScore", commScore);
        result.put("clarityScore", clarityScore);
        result.put("relevanceScore", relevanceScore);
        result.put("confidenceScore", 85);
        result.put("professionalismScore", 88);
        result.put("feedback", feedback);
        result.put("followUpQuestion", followUp);

        return result;
    }

    public InterviewEvaluationDto generateFinalEvaluation(UUID interviewId, List<InterviewAnswer> answers) {
        double avgComm = answers.stream().mapToInt(a -> a.getCommunicationScore() != null ? a.getCommunicationScore() : 80).average().orElse(80.0);
        double avgRelevance = answers.stream().mapToInt(a -> a.getRelevanceScore() != null ? a.getRelevanceScore() : 80).average().orElse(80.0);

        int overall = (int) Math.round((avgComm + avgRelevance) / 2.0);

        List<String> strengths = List.of(
                "Clear technical terminology and articulate communication",
                "Strong willingness to elaborate on software project experiences",
                "Good professional tone and structural approach to questions"
        );

        List<String> weaknesses = List.of(
                "Could provide deeper quantitative metrics (e.g. latency improvement, percentage gains)",
                "Needs more explicit STAR methodology framing for behavioral questions"
        );

        List<String> suggestions = List.of(
                "Practice 5 technical round questions on Java & Distributed Systems",
                "Prepare 2-minute concise STAR stories for past projects",
                "Take a timed contest to improve spontaneous response speed"
        );

        return InterviewEvaluationDto.builder()
                .interviewId(interviewId)
                .overallScore(overall)
                .communicationScore((int) avgComm)
                .clarityScore(85)
                .relevanceScore((int) avgRelevance)
                .confidenceScore(82)
                .professionalismScore(88)
                .strengths(strengths)
                .weaknesses(weaknesses)
                .improvementSuggestions(suggestions)
                .detailedSummary("Candidate demonstrated solid foundation for TCS Ninja HR & Technical rounds with professional demeanor.")
                .build();
    }

    private String callGeminiApi(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        String url = baseUrl + "/models/" + model + ":generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String jsonBody = "{\"contents\":[{\"parts\":[{\"text\":\"" + escapeJson(prompt) + "\"}]}]}";
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            List candidates = (List) response.getBody().get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map candidate = (Map) candidates.get(0);
                Map content = (Map) candidate.get("content");
                List parts = (List) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    Map part = (Map) parts.get(0);
                    return (String) part.get("text");
                }
            }
        }
        return "VERIXA AI: Unable to parse AI response stream.";
    }

    private AiChatResponse generateContextualFallback(AiChatRequest request, String context) {
        String prompt = request.getPrompt().toLowerCase();
        String reply = "Welcome to VERIXA AI! I am here to guide your placement preparation.";

        if (prompt.contains("hint")) {
            reply = "Here is a hint: Consider using a HashMap to store seen values for O(N) lookup time, or check boundary constraints before iterating.";
        } else if (prompt.contains("explain")) {
            reply = "To solve this question, first break down the problem statement into input/output constraints. Think about optimal time and space complexity before writing code.";
        } else if (prompt.contains("plan") || prompt.contains("tcs")) {
            reply = "For TCS Ninja Cadre: Focus on Aptitude (Speed/Distance, Percentages), Basic Java/C++ OOPs, SQL Joins, and 1-2 array/string coding problems.";
        } else {
            reply = "Great question! To excel in technical interviews, always state your approach out loud, state the time complexity (e.g. O(N log N)), and test edge cases like empty arrays or null values.";
        }

        return AiChatResponse.builder()
                .responseText(reply)
                .actionSuggestion("Try practicing a problem in Monaco Editor")
                .build();
    }

    private String escapeJson(String input) {
        return input.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
