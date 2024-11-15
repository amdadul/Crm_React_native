import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useAuth} from '../context/AuthContext';

const FloatingUserIcon = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {logout} = useAuth();

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        setUserName(name);
      } catch (error) {
        console.error('Failed to fetch user name from AsyncStorage:', error);
      }
    };

    fetchUserName();
  }, []);

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleMenuItemPress = (item: string) => {
    console.log(`${item} clicked`);
    if (item === 'logout') {
      handleLogout();
    }
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.iconContainer}>
        <Icon name="user-circle" size={30} color="#FFF" />
      </TouchableOpacity>

      {isVisible && (
        <Modal transparent={true} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={toggleDropdown}
          />
          <View style={styles.dropdownMenu}>
            <View style={styles.menuItem}>
              <Text style={styles.menuText}>{userName}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleMenuItemPress('profile')}
              style={styles.menuItem}>
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleMenuItemPress('logout')}
              style={styles.menuItem}>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 5,
    right: 10,
    zIndex: 1000,
  },
  iconContainer: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 5,
    paddingVertical: 8,
    width: 150,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FloatingUserIcon;
