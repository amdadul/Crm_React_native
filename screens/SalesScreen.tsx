// SalesScreen.tsx
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SalesHistory from '../components/SalesHistory';
import SalesScreenTabs from '../navigations/SalesScreenTabs';

const SalesScreen = () => {
  const [activeTab, setActiveTab] = useState('Create');

  const renderContent = () => {
    if (activeTab === 'Create') {
      return <Text style={styles.contentText}>Create Content</Text>;
    } else if (activeTab === 'History') {
      return <SalesHistory />;
    }
  };

  return (
    <View style={styles.container}>
      <SalesScreenTabs activeTab={activeTab} onTabPress={setActiveTab} />
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
    padding: 16,
  },
  contentText: {
    fontSize: 18,
    color: '#333',
  },
});

export default SalesScreen;
