import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const HomePageCard = ({title, subTitle, count}) => {
  return (
    <View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitleText}>{title}</Text>
          <Text style={styles.cardSubtitleText}>{subTitle}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardBodyText}>{count}</Text>
        </View>
      </View>
    </View>
  );
};

export default HomePageCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  cardSubtitleText: {
    fontSize: 14,
    color: '#888888',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardBodyText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
});
