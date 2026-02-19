package org.example.service;
import org.example.DAO.UserDAO;
import org.example.entity.User;

public class AuthService {

    private final UserDAO userDAO = new UserDAO();

    public User login(String email, String password) {
        User user = userDAO.findByEmail(email);

        if (user == null) return null;

        // plain password for now (we’ll hash later)
        if (user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}


