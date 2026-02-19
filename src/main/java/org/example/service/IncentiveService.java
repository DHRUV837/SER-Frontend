package org.example.service;

import org.example.DAO.IncentiveDAO;
import org.example.DAO.SaleDAO;
import org.example.DAO.UserDAO;
import org.example.entity.Incentive;
import org.example.entity.Sale;
import org.example.entity.User;

import java.util.List;

public class IncentiveService {

    public Incentive calculateAndSave(
            Long userId,
            int month,
            int year,
            double incentiveRate
    ) {
        SaleDAO saleDAO = new SaleDAO();
        UserDAO userDAO = new UserDAO();
        IncentiveDAO incentiveDAO = new IncentiveDAO();

        List<Sale> sales = saleDAO.findByUserAndMonth(userId, month, year);

        double totalSales = sales.stream()
                .mapToDouble(Sale::getAmount)
                .sum();

        double incentiveAmount = totalSales * (incentiveRate / 100.0);

        User user = userDAO.findById(userId);

        Incentive incentive = new Incentive();
        incentive.setSalesPerson(user);
        incentive.setMonth(month);
        incentive.setYear(year);
        incentive.setTotalSales(totalSales);
        incentive.setIncentiveAmount(incentiveAmount);
        // 🔥 SAVE TO DATABASE
        incentiveDAO.save(incentive);

        return incentive;
    }
}
