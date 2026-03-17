import { createContext, useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    fetchUser().finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
