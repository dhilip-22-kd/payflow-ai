package com.payflow.backend;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/paypal")
public class PayPalController {

    private final PayPalService payPalService;

    public PayPalController(PayPalService payPalService) {
        this.payPalService = payPalService;
    }

    @GetMapping("/test")
    public ResponseEntity<?> testPayPalConnection() {

        try {
            Map<String, Object> result =
                    payPalService.getAccessTokenInfo();

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of(
                            "authenticated", false,
                            "message", "PayPal Sandbox authentication failed."
                    ));
        }
    }
}