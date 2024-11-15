import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {getTotalSalesApi, getTotalStockApi} from '../api/CrmApi';
import FloatingUserIcon from '../components/FloatingUserIcon';
import HomePageCard from '../components/HomePageCard';
import Loader from '../components/Loader';

const HomeScreen = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);

  const getSalesFromApi = async () => {
    const response = await getTotalSalesApi();
    if (response.success) {
      setTotalSales(response.data);
    } else {
      setTotalSales(0);
      Toast.show({
        type: 'error',
        position: 'top', // Show the toast at the top
        text1: response.error,
        visibilityTime: 3000,
        topOffset: 50,
      });
    }
  };

  const getStockFromApi = async () => {
    const response = await getTotalStockApi();
    if (response.success) {
      setTotalStock(response.data);
    } else {
      setTotalStock(0);
      Toast.show({
        type: 'error',
        position: 'top', // Show the toast at the top
        text1: response.error,
        visibilityTime: 3000,
        topOffset: 50,
      });
    }
  };

  const fetchData = async () => {
    setLoading(true); // Start loading
    await Promise.all([getSalesFromApi(), getStockFromApi()]);
    setLoading(false); // Stop loading
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <FloatingUserIcon />
        <View style={styles.header}>
          <Text style={styles.headerText}>Oneplus CRM</Text>
        </View>
      </View>
      {loading ? (
        <Loader />
      ) : (
        <View style={styles.cardContainer}>
          <HomePageCard
            title={'Total Sales'}
            subTitle={'This Months'}
            count={totalSales}
          />
          <HomePageCard
            title={'Total Stock'}
            subTitle={'Quantity'}
            count={totalStock}
          />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});
