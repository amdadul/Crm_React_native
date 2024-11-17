import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {getStockListApi} from '../api/CrmApi';

const StockScreen = () => {
  const [data, setData] = useState([]); // Store the table data
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [lastPage, setLastPage] = useState(1); // Last page
  const [loading, setLoading] = useState(false); // Loading state

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getStockListApi(page);

      setData(
        page === 1 ? response?.data?.data : [...data, ...response.data?.data],
      );
      setCurrentPage(response?.data?.meta?.current_page);
      setLastPage(response?.data?.meta?.last_page);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching data',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1); // Load the first page on component mount
  }, []);

  const loadMore = () => {
    if (currentPage < lastPage && !loading) {
      fetchData(currentPage + 1);
    }
  };

  const renderRow = ({item}) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.nameCell]}>{item.product_name}</Text>
      <Text style={[styles.cell, styles.valueCell]}>{item.stock}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.nameCell]}>Product Name</Text>
        <Text style={[styles.headerCell, styles.valueCell]}>Stock</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderRow}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={
          loading && <Text style={styles.loadingText}>Loading...</Text>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5} // Trigger when 50% of the list is scrolled
      />
    </View>
  );
};

export default StockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 7, // 70% of available space (adjusted relative to other flex values)
  },
  valueCell: {
    flex: 3, // Adjust flex for Value column
  },
  loadingText: {
    textAlign: 'center',
    padding: 10,
    color: '#888',
  },
});
