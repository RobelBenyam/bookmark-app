import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/auth';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      // Set the token in the API service
      authService.setToken(token);
      // Fetch user data
      api.get('/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // If token is invalid, clear it
          authService.removeToken();
          setUser(null);
        });
    }
  }, []);

  const login = (token: string, user: User) => {
    authService.setToken(token);
    setUser(user);
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 