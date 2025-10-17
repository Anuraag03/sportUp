import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);

        // Check if token exists and is still valid
        if (userData.token) {
          const decoded = jwtDecode(userData.token);
          const currentTime = Date.now() / 1000;

          // If token is expired, clear it
          if (decoded.exp < currentTime) {
            console.log("Token expired, clearing user data");
            localStorage.removeItem("user");
            setUser(null);
          } else {
            setUser(userData);
          }
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
