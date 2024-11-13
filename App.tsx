// App.tsx
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure this is installed

import {AuthProvider, useAuth} from './context/AuthContext';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SalesScreen from './screens/SalesScreen';
import StockScreen from './screens/StockScreen';
import StockUpdateScreen from './screens/StockUpdateScreen';

// Define type for bottom tab navigation
export type BottomTabParamList = {
  Home: undefined;
  Sales: undefined;
  Stock: undefined;
  StockUpdate: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Sales') {
            iconName = 'settings-outline';
          } else if (route.name === 'Stock') {
            iconName = 'stock-outline';
          } else if (route.name === 'StockUpdate') {
            iconName = 'StockUpdate-outline';
          }

          return <Icon name={iconName as string} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
      <Tab.Screen name="StockUpdate" component={StockUpdateScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const {isAuthenticated} = useAuth();

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
