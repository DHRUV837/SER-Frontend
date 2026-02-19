package org.example.DAO;
import org.example.config.HibernateUtil;
import org.example.entity.Sale;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class SaleDAO {

    public void save(Sale sale) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = session.beginTransaction();
        session.persist(sale);
        tx.commit();
        session.close();
    }

    public List<Sale> findByUserAndMonth(Long userId, int month, int year) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        List<Sale> list = session.createQuery(
                        "FROM Sale s WHERE s.salesPerson.id = :uid " +
                                "AND MONTH(s.saleDate) = :m AND YEAR(s.saleDate) = :y",
                        Sale.class)
                .setParameter("uid", userId)
                .setParameter("m", month)
                .setParameter("y", year)
                .list();

        session.close();
        return list;
    }
}

