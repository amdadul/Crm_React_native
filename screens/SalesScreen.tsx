// SalesScreen.tsx
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Loader from '../components/Loader';
import SalesCreate from '../components/SalesCreate';
import SalesHistory from '../components/SalesHistory';
import SerialNoVerify from '../components/SerialNoVerify';
import SalesScreenTabs from '../navigations/SalesScreenTabs';

const SalesScreen = () => {
  const [activeTab, setActiveTab] = useState('Create');
  const [data, setData] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const renderContent = () => {
    if (activeTab === 'Create') {
      if (isLoading) {
        return <Loader />;
      }
      if (isPreview) {
        return (
          <SalesCreate
            setIsPreview={setIsPreview}
            setIsLoading={setIsLoading}
            data={data}
          />
        );
      } else {
        return (
          <SerialNoVerify
            setIsPreview={setIsPreview}
            setIsLoading={setIsLoading}
            setData={setData}
          />
        );
      }
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
