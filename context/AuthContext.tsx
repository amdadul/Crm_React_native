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
  isManagement: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isManagement, setIsManagement] = useState(false);

  // Function to check if the stored token is still valid
  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const expirationDate = await AsyncStorage.getItem('tokenExpiration');

      if (token && expirationDate) {
        const isExpired =
          new Date().getTime() > new Date(expirationDate).getTime();
        if (isExpired) {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('tokenExpiration');
        }
        setIsAuthenticated(!isExpired);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking token:', error);
      setIsAuthenticated(false);
    }
  };

  const checkManagement = async () => {
    try {
      const type = await AsyncStorage.getItem('userType');

      if (type && type === '2') {
        setIsManagement(true);
      } else {
        setIsManagement(false);
      }
    } catch (error) {
      console.error('Error checking management:', error);
      setIsManagement(false);
    }
  };

  useEffect(() => {
    checkToken();
    checkManagement();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);

      if (response.success) {
        const token = response?.data?.token;
        const userName = response?.data?.name;
        const userPhone = response?.data?.phone;
        const userType = response?.data?.employee_type;

        // Set token expiration date 10 days from now
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 10);

        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userName', userName);
        await AsyncStorage.setItem('userPhone', userPhone);
        await AsyncStorage.setItem('userType', userType.toString());
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
    try {
      await logoutApi();
      setIsAuthenticated(false);
      setIsManagement(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated, isManagement, login, logout}}>
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
