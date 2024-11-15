// SalesScreenTabs.tsx
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const StockUpdateScreenTabs = ({activeTab, onTabPress}) => (
  <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'Create' && styles.activeTab]}
      onPress={() => onTabPress('Create')}>
      <Text
        style={[
          styles.tabText,
          activeTab === 'Create' && styles.activeTabText,
        ]}>
        Update Stock
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'History' && styles.activeTab]}
      onPress={() => onTabPress('History')}>
      <Text
        style={[
          styles.tabText,
          activeTab === 'History' && styles.activeTabText,
        ]}>
        History
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007aff',
  },
  tabText: {
    fontSize: 16,
    color: '#8e8e93',
  },
  activeTabText: {
    color: '#007aff',
    fontWeight: 'bold',
  },
});

export default StockUpdateScreenTabs;
