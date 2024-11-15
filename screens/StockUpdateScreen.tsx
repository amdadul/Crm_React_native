import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import StockUpdateHistory from '../components/StockUpdateHistory';
import StockUpdateScreenTabs from '../navigations/StockUpdateScreenTabs';

const StockUpdateScreen = () => {
  const [activeTab, setActiveTab] = useState('Create');

  const renderContent = () => {
    if (activeTab === 'Create') {
      return <Text style={styles.contentText}>Create Content</Text>;
    } else if (activeTab === 'History') {
      return <StockUpdateHistory />;
    }
  };

  return (
    <View style={styles.container}>
      <StockUpdateScreenTabs activeTab={activeTab} onTabPress={setActiveTab} />
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'stretch',
    padding: 16,
  },
  contentText: {
    fontSize: 18,
    color: '#333',
  },
});

export default StockUpdateScreen;
