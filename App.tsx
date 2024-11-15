// App.tsx
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AuthProvider, useAuth} from './context/AuthContext';

import Toast from 'react-native-toast-message';
import toastConfig from './components/toastConfig';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SalesScreen from './screens/SalesScreen';
import StockScreen from './screens/StockScreen';
import StockUpdateScreen from './screens/StockUpdateScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// const CustomHeader = ({navigation, route}) => (
//   <View
//     style={{
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       padding: 10,
//     }}>
//     <Text style={{fontSize: 20, fontWeight: 'bold'}}>{route.name}</Text>
//     <UserProfileDropdownMenu />
//   </View>
// );

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
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Sales') {
            iconName = 'cart-outline';
          } else if (route.name === 'Stock') {
            iconName = 'layers-outline';
          } else if (route.name === 'Stock Update') {
            iconName = 'pencil-outline';
          }

          return (
            <Ionicons name={iconName as string} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Sales"
        component={SalesScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Stock"
        component={StockScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Stock Update"
        component={StockUpdateScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const {isAuthenticated} = useAuth();

  return isAuthenticated ? (
    <React.Fragment>
      <AppStack />
    </React.Fragment>
  ) : (
    <AuthStack />
  );
}

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
