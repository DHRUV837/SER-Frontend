package org.example.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.entity.User;
import org.example.service.AuthService;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

@WebServlet("/api/auth/login")
public class LoginServlet extends HttpServlet {

    private final AuthService authService = new AuthService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> body =
                mapper.readValue(req.getInputStream(), Map.class);

        User user = authService.login(
                body.get("email"),
                body.get("password")
        );

        resp.setContentType("application/json");

        if (user == null) {
            resp.setStatus(401);
            resp.getWriter().write("{\"error\":\"Invalid credentials\"}");
        } else {
            mapper.writeValue(resp.getWriter(), user);
        }
    }
}

