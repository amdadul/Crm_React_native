import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const StockUpdateDetailsModal = ({isVisible, selectedItem, closeModal}) => {
  if (!selectedItem) {
    return null;
  }

  // Function to split serial_no into individual serial numbers
  const getSerialNumbers = serial_no => serial_no.split(','); // Split comma-separated SNs

  const renderRow = ({item}) => {
    const serialNumbers = getSerialNumbers(item.serial_no); // Split serial_no into array

    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.nameCell]}>
          {item.product_name}
          {/* Render each serial number as a badge below the product name */}
          <View style={styles.badgeContainer}>
            {serialNumbers.map((sn, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{sn.trim()}</Text>
              </View>
            ))}
          </View>
        </Text>
        <Text style={[styles.cell, styles.valueCell]}>{item.quantity}</Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Details for {selectedItem.order_no}
          </Text>
          <View style={styles.container}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.nameCell]}>
                Product Name
              </Text>
              <Text style={[styles.headerCell, styles.valueCell]}>
                Quantity
              </Text>
            </View>
            <FlatList
              data={selectedItem.details}
              renderItem={renderRow}
              keyExtractor={item => item.id.toString()}
            />
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  nameCell: {
    flex: 7, // Adjust flex for product name column
  },
  valueCell: {
    flex: 3, // Adjust flex for quantity column
  },
  badgeContainer: {
    marginTop: 8, // Space between product name and badges
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap', // Allow badges to wrap if there's more than one
  },
  badge: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    margin: 3, // Space between badges
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    padding: 10,
    color: '#888',
  },
});

export default StockUpdateDetailsModal;
