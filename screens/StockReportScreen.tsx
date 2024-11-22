import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {DocumentDirectoryPath, writeFile} from 'react-native-fs';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import {getDropdownData, getStockReport} from '../api/CrmApi';

const StockReportScreen = () => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [options, setOptions] = useState([]);

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

    let currentDateOnly = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Optional: Use 24-hour format. Set to `true` for 12-hour format.
    }).format(new Date());
    currentDateOnly = currentDateOnly.replace(',', '');

    const selectedOption = options.find(item => item.value === selectedValue);
    const selectedText = selectedOption
      ? selectedOption.label
      : 'No Store Selected';

    try {
      const response = await getStockReport(selectedValue);

      const blob = await response.blob();
      const fileName = `Stock_report_of_${selectedText}_at_${currentDateOnly}.xlsx`;
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
    marginTop: 20,
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StockReportScreen;
