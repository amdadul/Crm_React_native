import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {DocumentDirectoryPath, writeFile} from 'react-native-fs';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import {getDropdownData, getSalesReport} from '../api/CrmApi';

const SalesReportScreen = () => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Fetch dropdown data from API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await getDropdownData();
        const data = response.data.map(item => ({
          label: item.name,
          value: item.id,
        }));
        data.unshift({label: 'All Store', value: ''});
        setOptions(data);
      } catch (error) {
        console.error('Error fetching options:', error);
        Toast.show({
          type: 'error',
          text1: 'Error fetching data.',
          text2: 'Please try again later.',
        });
      }
    };

    fetchOptions();
  }, []);

  // Handle Excel download
  const handleDownload = async () => {
    if (selectedValue === null) {
      Alert.alert('Validation Error', 'Please select a store.');
      return;
    }

    const startDateOnly = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(startDate);
    const endDateOnly = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(endDate);

    const selectedOption = options.find(item => item.value === selectedValue);
    const selectedText = selectedOption
      ? selectedOption.label
      : 'No Store Selected';

    try {
      const response = await getSalesReport(
        startDateOnly,
        endDateOnly,
        selectedValue,
      );

      const blob = await response.blob();
      const fileName = `sales_report_from_${startDateOnly}_to_${endDateOnly}_of_${selectedText}.xlsx`;
      const sanitizedFileName = fileName
        .replace(/\s+/g, '_')
        .replace(/[^\w\s]/gi, '');

      const filePath = `${DocumentDirectoryPath}/${sanitizedFileName}`;

      // Save file locally
      await writeFile(filePath, blob, 'utf8');
      Alert.alert('Download Successful', `File saved at ${filePath}`, [
        {
          text: 'Open File',
          onPress: async () => {
            try {
              const shareOptions = {
                url: `file://${filePath}`,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // MIME type for Excel files
              };

              await Share.open(shareOptions);
            } catch (err) {
              //Alert.alert('Error', 'Could not open the file.');
            }
          },
        },
        {text: 'OK', style: 'cancel'},
      ]);
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', 'Failed to download the report.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Store:</Text>
      <DropDownPicker
        open={open}
        value={selectedValue}
        items={options}
        setOpen={setOpen}
        setValue={setSelectedValue}
        placeholder="Select Store"
        searchable={true}
      />

      <Text style={styles.label}>Start Date:</Text>
      <TouchableOpacity
        onPress={() => setShowStartPicker(true)}
        style={styles.datePicker}>
        <Text>{startDate.toDateString()}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      <Text style={styles.label}>End Date:</Text>
      <TouchableOpacity
        onPress={() => setShowEndPicker(true)}
        style={styles.datePicker}>
        <Text>{endDate.toDateString()}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadText}>Download Excel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  datePicker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  downloadButton: {
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SalesReportScreen;