import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getStockUpdateListApi} from '../api/CrmApi';
import StockUpdateDetailsModal from './StockUpdateDetailsModal';

const StockUpdateHistory = () => {
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
      const response = await getStockUpdateListApi(page);
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

  const renderCard = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardContentHolder}>
        {/* Left-aligned content */}
        <View style={styles.leftContent}>
          <Text style={styles.cardDescription}>{item.date}</Text>
          <Text style={styles.cardDescription}>Qty: {item.quantity}</Text>
        </View>

        {/* Right-aligned content */}
        <View style={styles.rightContent}>
          <Text style={styles.cardOrderNo}>{item.order_no}</Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewDetails(item)}>
            <Icon name="eye" size={20} color="#fff" />
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
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

export default StockUpdateHistory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    width: '100%',
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
  cardContentHolder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  leftContent: {
    justifyContent: 'flex-start',
  },
  cardDescription: {
    fontSize: 15,
    color: '#333333',
    marginBottom: 5,
  },
  rightContent: {
    justifyContent: 'flex-end',
  },
  cardOrderNo: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
