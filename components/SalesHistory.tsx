import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {getSalesListApi} from '../api/CrmApi';
import StockUpdateDetailsModal from './StockUpdateDetailsModal';

const SalesHistory = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async (page = 1, isRefreshing = false) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await getSalesListApi(page);
      if (response.success) {
        if (isRefreshing) {
          setData(response.data.data); // Overwrite data on refresh
        } else {
          setData(
            page === 1 ? response.data.data : [...data, ...response.data.data],
          ); // Append data
        }

        setCurrentPage(response?.data?.meta?.current_page);
        setLastPage(response?.data?.meta?.last_page);
      } else {
        Toast.show({
          type: 'error',
          text1: response.error,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching data',
        text2: error.message,
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const loadMore = () => {
    if (currentPage < lastPage && !loading) {
      fetchData(currentPage + 1);
    }
  };

  const refreshData = () => {
    setIsRefreshing(true);
    fetchData(1, true);
  };

  const handleViewDetails = item => {
    setSelectedItem(item);
    setIsModalVisible(true); // Show modal
  };

  const closeModal = () => {
    setIsModalVisible(false); // Close modal
    setSelectedItem(null); // Clear selected item
  };

  // Layout handler to ensure cards stretch correctly
  const renderCard = ({item}) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.cardTitle}>{item.product_name}</Text>
      </View>
      <View style={styles.cardContentHolder}>
        <View style={styles.cardItems}>
          <Text style={styles.cardDescription}>{item.date}</Text>
          <Text style={styles.cardDescription}>{item.name}</Text>
          <Text style={styles.cardDescription}>Qty: {item.quantity}</Text>
        </View>
        <View style={[styles.cardItems, styles.cardItemsContent]}>
          <Text style={styles.cardDescription}>{item.order_no}</Text>
          <Text style={styles.cardDescription}>{item.phone}</Text>
          <Text style={styles.cardDescription}>{item.serial_no}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refreshData}
        contentContainerStyle={styles.flatListContent}
        ListFooterComponent={
          loading && <ActivityIndicator size="large" color="#007bff" />
        }
      />
      <StockUpdateDetailsModal
        isVisible={isModalVisible}
        selectedItem={selectedItem}
        closeModal={closeModal}
      />
    </View>
  );
};

export default SalesHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  flatListContent: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
    width: '100%',
    alignSelf: 'stretch',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  cardDescription: {
    fontSize: 15,
    color: '#333333',
  },
  cardContentHolder: {
    flex: 1,
    flexDirection: 'row',
  },
  cardItems: {
    width: '50%',
  },
  cardItemsContent: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
});
