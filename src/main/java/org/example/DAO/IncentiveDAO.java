package org.example.DAO;

import org.example.entity.Incentive;
import org.example.config.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.List;

public class IncentiveDAO {

    // ✅ Save incentive
    public void save(Incentive incentive) {

        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = session.beginTransaction();

        session.save(incentive);

        tx.commit();
        session.close();
    }

    // ✅ Incentive history (table view)
    public List<Incentive> findByUser(Long userId) {

        Session session = HibernateUtil.getSessionFactory().openSession();

        Query<Incentive> q = session.createQuery(
                "FROM Incentive i WHERE i.salesPerson.id = :uid " +
                        "ORDER BY i.year DESC, i.month DESC",
                Incentive.class
        );

        q.setParameter("uid", userId);

        List<Incentive> list = q.list();
        session.close();

        return list;
    }

    // ✅ Monthly chart data
    public List<Object[]> getMonthlyIncentive(Long userId, int year) {

        Session session = HibernateUtil.getSessionFactory().openSession();

        Query<Object[]> q = session.createQuery(
                "SELECT i.month, i.incentiveAmount " +
                        "FROM Incentive i " +
                        "WHERE i.salesPerson.id = :uid AND i.year = :year " +
                        "ORDER BY i.month",
                Object[].class
        );

        q.setParameter("uid", userId);
        q.setParameter("year", year);

        List<Object[]> result = q.list();
        session.close();

        return result;
    }

    // ✅ Yearly total incentive
    public Double getYearlyTotal(Long userId, int year) {

        Session session = HibernateUtil.getSessionFactory().openSession();

        Query<Double> q = session.createQuery(
                "SELECT SUM(i.incentiveAmount) " +
                        "FROM Incentive i " +
                        "WHERE i.salesPerson.id = :uid AND i.year = :year",
                Double.class
        );

        q.setParameter("uid", userId);
        q.setParameter("year", year);

        Double total = q.uniqueResult();
        session.close();

        return total == null ? 0 : total;
    }
}
