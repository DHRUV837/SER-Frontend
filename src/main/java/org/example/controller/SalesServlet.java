package org.example.controller;



import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.DAO.SaleDAO;
import org.example.DAO.UserDAO;
import org.example.entity.Sale;
import org.example.entity.User;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

@WebServlet(name = "SalesServlet", urlPatterns = "/api/sales")
public class SalesServlet extends HttpServlet {

    private final SaleDAO saleDAO = new SaleDAO();
    private final UserDAO userDAO = new UserDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        // Read JSON body
        Map<String, Object> body =
                mapper.readValue(req.getInputStream(), Map.class);

        Long userId = Long.valueOf(body.get("userId").toString());
        double amount = Double.parseDouble(body.get("amount").toString());
        LocalDate saleDate = LocalDate.parse(body.get("saleDate").toString());

        User user = userDAO.findById(userId);
        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("User not found");
            return;
        }

        Sale sale = new Sale();
        sale.setSalesPerson(user);
        sale.setAmount(amount);
        sale.setSaleDate(saleDate);

        saleDAO.save(sale);

        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.setContentType("application/json");
        mapper.writeValue(resp.getWriter(), sale);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        Long userId = Long.parseLong(req.getParameter("userId"));
        int month = Integer.parseInt(req.getParameter("month"));
        int year = Integer.parseInt(req.getParameter("year"));

        resp.setContentType("application/json");
        mapper.writeValue(
                resp.getWriter(),
                saleDAO.findByUserAndMonth(userId, month, year)
        );
    }
}

