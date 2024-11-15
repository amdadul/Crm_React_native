// AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Toast from 'react-native-toast-message';
import {loginApi, logoutApi} from '../api/CrmApi';
type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check if the stored token is still valid
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const expirationDate = await AsyncStorage.getItem('tokenExpiration');

    if (token && expirationDate) {
      const isExpired =
        new Date().getTime() > new Date(expirationDate).getTime();
      setIsAuthenticated(!isExpired);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);

      if (response.success) {
        const token = response?.data?.token;
        const userName = response?.data?.name;

        // Set token expiration date 10 days from now
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 10);

        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userName', userName);
        await AsyncStorage.setItem(
          'tokenExpiration',
          expirationDate.toISOString(),
        );
        setIsAuthenticated(true);
      } else {
        Toast.show({
          type: 'error',
          position: 'top', // Show the toast at the top
          text1: response.error,
          visibilityTime: 3000,
          topOffset: 50,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top', // Show the toast at the top
        text1: error,
        visibilityTime: 3000,
        topOffset: 50,
      });
    }
  };

  const logout = async () => {
    await logoutApi();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
