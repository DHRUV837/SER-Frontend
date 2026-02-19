package org.example.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.DTO.IncentiveRequestDTO;
import org.example.entity.Incentive;
import org.example.service.IncentiveService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/incentive")
public class IncentiveServlet extends HttpServlet {

    private final IncentiveService incentiveService = new IncentiveService();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        // 🔹 Read JSON request
        IncentiveRequestDTO dto =
                mapper.readValue(req.getInputStream(), IncentiveRequestDTO.class);

        // 🔹 Calculate incentive
        Incentive incentive = incentiveService.calculateAndSave(
                dto.getUserId(),
                dto.getMonth(),
                dto.getYear(),
                dto.getIncentiveRate()
        );

        // 🔹 Send JSON response
        resp.setContentType("application/json");
        resp.setStatus(HttpServletResponse.SC_OK);

        mapper.writeValue(resp.getOutputStream(), incentive);
    }
}
