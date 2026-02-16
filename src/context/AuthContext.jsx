import { createContext, useContext, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);

    // Apply Theme directly
    if (data?.preferences?.theme === "DARK") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    document.documentElement.classList.remove("dark");
  };

  const updateUser = (hasCompletedOnboarding) => {
    const newAuth = { ...auth, user: { ...auth.user, onboardingCompleted: hasCompletedOnboarding }, onboardingCompleted: hasCompletedOnboarding };
    // Note: Backend sending 'onboardingCompleted' at top level and inside user object in AuthController.
    // We should update both to be safe.
    localStorage.setItem("auth", JSON.stringify(newAuth));
    setAuth(newAuth);
  };

  // On mount check theme
  if (auth?.preferences?.theme === "DARK") {
    document.documentElement.classList.add("dark");
  }

  /* New Register Function */
  /* New Register Function */
  const register = async (name, email, password, role, extraData = {}) => {
    try {
      // Use api.post instead of fetch
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
        role,
        ...extraData
      });

      login(data);
      return data;
    } catch (error) {
      // Axios error handling
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Registration failed";
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateUser, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
