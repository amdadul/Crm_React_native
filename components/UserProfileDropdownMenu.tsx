import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserProfileDropdownMenu = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const handleMenuItemPress = (item: string) => {
    console.log(`${item} clicked`);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.iconContainer}>
        <Icon name="user-circle" size={30} color="#000" />
      </TouchableOpacity>

      {isVisible && (
        <Modal transparent={true} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={toggleDropdown}
          />
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              onPress={() => handleMenuItemPress('name')}
              style={styles.menuItem}>
              <Text style={styles.menuText}>Name</Text>
            </TouchableOpacity>
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
    top: 10,
    right: 10,
    zIndex: 1,
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
    top: 50,
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

export default UserProfileDropdownMenu;
