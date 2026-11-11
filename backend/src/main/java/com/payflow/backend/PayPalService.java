package com.payflow.backend;

import java.time.Instant;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Service
public class PayPalService {

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.client-secret}")
    private String clientSecret;

    @Value("${paypal.base-url:https://api-m.sandbox.paypal.com}")
    private String baseUrl;

    private final RestClient restClient = RestClient.builder().build();

    public boolean isConfigured() {
        return clientId != null && !clientId.isBlank()
                && clientSecret != null && !clientSecret.isBlank();
    }

    public Map<String, Object> getAccessTokenInfo() {
        Map<String, Object> response = fetchAccessTokenResponse();

        long expiresIn = ((Number) response.get("expires_in")).longValue();

        return Map.of(
                "authenticated", true,
                "tokenType", response.get("token_type"),
                "expiresInSeconds", expiresIn,
                "expiresAt", Instant.now().plusSeconds(expiresIn).toString()
        );
    }

    public Map<String, Object> createOrder(String amount, String currency) {
        String accessToken = getAccessToken();

        Map<String, Object> amountDetails = Map.of(
                "currency_code", currency,
                "value", amount
        );

        Map<String, Object> purchaseUnit = Map.of(
                "amount", amountDetails
        );

        Map<String, Object> requestBody = Map.of(
                "intent", "CAPTURE",
                "purchase_units", java.util.List.of(purchaseUnit),
                "application_context", Map.of(
                        "return_url", "http://localhost:5173/payment/success",
                        "cancel_url", "http://localhost:5173/payment/cancel"
                )
        );

        Map<String, Object> response = restClient.post()
                .uri(baseUrl + "/v2/checkout/orders")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        if (response == null || !response.containsKey("id")) {
            throw new IllegalStateException(
                    "PayPal order creation failed.");
        }

        return response;
    }

    private String getAccessToken() {
        return (String) fetchAccessTokenResponse().get("access_token");
    }

    private Map<String, Object> fetchAccessTokenResponse() {
        if (!isConfigured()) {
            throw new IllegalStateException(
                    "PayPal credentials are not configured.");
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");

        Map<String, Object> response = restClient.post()
                .uri(baseUrl + "/v1/oauth2/token")
                .headers(headers -> headers.setBasicAuth(
                        clientId, clientSecret))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .accept(MediaType.APPLICATION_JSON)
                .body(form)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        if (response == null || !response.containsKey("access_token")) {
            throw new IllegalStateException(
                    "PayPal did not return an access token.");
        }

        return response;
    }
}
