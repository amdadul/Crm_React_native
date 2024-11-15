import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BaseToastProps} from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  error: ({text1, text2}: CustomToastProps) => (
    <View style={[styles.toastBase, styles.errorToast]}>
      <Icon
        name="exclamation-circle"
        size={24}
        color="#D92D20"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.errorText1}>{text1}</Text>}
        {text2 && <Text style={styles.errorText2}>{text2}</Text>}
      </View>
    </View>
  ),
  success: ({text1, text2}: CustomToastProps) => (
    <View style={[styles.toastBase, styles.successToast]}>
      <Icon name="check-circle" size={24} color="#067647" style={styles.icon} />
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.successText1}>{text1}</Text>}
        {text2 && <Text style={styles.successText2}>{text2}</Text>}
      </View>
    </View>
  ),
  delete: ({text1, text2}: CustomToastProps) => (
    <View style={[styles.toastBase, styles.deleteToast]}>
      <Icon name="trash" size={24} color="#D92D20" style={styles.icon} />
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.deleteText1}>{text1}</Text>}
        {text2 && <Text style={styles.deleteText2}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  // Base styling for all toasts
  toastBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    height: 70,
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },

  // Specific toast types
  errorToast: {
    borderColor: '#D92D20',
    backgroundColor: '#FEF3F2',
  },
  errorText1: {
    color: '#D92D20',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorText2: {
    color: '#D92D20',
    fontSize: 12,
  },
  successToast: {
    borderColor: '#ABEFC6',
    backgroundColor: '#ECFDF3',
  },
  successText1: {
    color: '#067647',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  successText2: {
    color: '#067647',
    fontSize: 12,
  },
  deleteToast: {
    borderColor: '#D92D20',
    backgroundColor: '#FEF3F2',
  },
  deleteText1: {
    color: '#D92D20',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  deleteText2: {
    color: '#D92D20',
    fontSize: 12,
  },
});

export default toastConfig;
