import NetInfo from '@react-native-community/netinfo';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AuthProvider, useAuth} from './context/AuthContext';

import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import toastConfig from './components/toastConfig';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SalesReportScreen from './screens/SalesReportScreen';
import SalesScreen from './screens/SalesScreen';
import StockReportScreen from './screens/StockReportScreen';
import StockScreen from './screens/StockScreen';
import StockUpdateScreen from './screens/StockUpdateScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
          } else if (route.name === 'StockUpdate') {
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
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
      <Tab.Screen
        name="StockUpdate"
        options={{title: 'Stock Update'}}
        component={StockUpdateScreen}
      />
    </Tab.Navigator>
  );
}

function MngStack() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'SalesReport') {
            iconName = 'cart-outline';
          } else if (route.name === 'StockReport') {
            iconName = 'layers-outline';
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
        name="SalesReport"
        options={{title: 'Sales Report'}}
        component={SalesReportScreen}
      />
      <Tab.Screen
        name="StockReport"
        options={{title: 'Stock Report'}}
        component={StockReportScreen}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppTabs"
        component={AppStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{title: 'Change Password'}}
      />
    </Stack.Navigator>
  );
}

function MngMainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppTabs"
        component={MngStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{title: 'Change Password'}}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const {isAuthenticated, isManagement} = useAuth();

  return isAuthenticated ? (
    isManagement ? (
      <MngMainStack />
    ) : (
      <MainStack />
    )
  ) : (
    <AuthStack />
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
        <Toast config={toastConfig} />
      </NavigationContainer>
      {!isConnected && (
        <View style={styles.container}>
          <Modal transparent={true} animationType="fade" visible={!isConnected}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>No Internet Connection</Text>
                <Text style={styles.subText}>
                  Please check your network settings.
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => {
                    // Manually recheck connection
                    NetInfo.fetch().then(state =>
                      setIsConnected(state.isConnected),
                    );
                  }}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
