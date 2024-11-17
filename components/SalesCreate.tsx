import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {salesCreateApi} from '../api/CrmApi';

const SalesCreate = ({setIsPreview, data}) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      serial_no: '', // Hidden field
    },
  });
  useEffect(() => {
    const concatenatedSerialNos = data.map(item => item.serial_no).join(',');
    setValue('serial_no', concatenatedSerialNos);
  }, [data, setValue]);

  const onSubmit = async formData => {
    const response = await salesCreateApi(formData);

    if (response.success) {
      Toast.show({
        type: 'success',
        text1: response.data.message,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: response.error,
      });
    }
    setIsPreview(false);
  };

  const getSerialNumbers = serial_no => serial_no.split(',');

  const renderRow = ({item, index}) => {
    const serialNumbers = getSerialNumbers(item.serial_no);

    return (
      <View
        style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
        <View style={styles.productContainer}>
          <Text style={[styles.productName, styles.nameCell]}>
            {item.product_name}
          </Text>
          <View style={styles.badgeContainer}>
            {serialNumbers.map((sn, idx) => (
              <View key={idx} style={styles.badge}>
                <Text style={styles.badgeText}>{sn.trim()}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={[styles.cell, styles.valueCell]}>{item.quantity}</Text>
      </View>
    );
  };

  return (
    <View style={styles.modalContainer}>
      {/* Product List */}
      <View style={styles.container}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.nameCell]}>Product Name</Text>
          <Text style={[styles.headerCell, styles.valueCell]}>Quantity</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderRow}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.loadingText}>No Data Available</Text>
          }
        />
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Name and Phone in the same row */}
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Text style={styles.formLabel}>
              Name <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              name="name"
              control={control}
              rules={{required: 'Name is required'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.name && styles.errorBorder]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter Name"
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.formLabel}>
              Phone <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Phone is required',
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: 'Invalid phone number',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.phone && styles.errorBorder]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter Phone"
                  keyboardType="numeric"
                />
              )}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone.message}</Text>
            )}
          </View>
        </View>

        {/* Address in a separate row */}
        <View>
          <Text style={styles.formLabel}>Address</Text>
          <Controller
            name="address"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={[styles.input, errors.address && styles.errorBorder]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Address"
              />
            )}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address.message}</Text>
          )}
        </View>
      </View>

      {/* Hidden Field (serial_no) */}
      <Controller
        name="serial_no"
        control={control}
        render={({field: {value}}) => (
          <Text style={styles.hiddenField}>{value}</Text>
        )}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsPreview(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SalesCreate;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    width: '100%',
  },
  header: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  productContainer: {
    flex: 7,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  badge: {
    backgroundColor: '#e7f1ff',
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
  },
  badgeText: {
    fontSize: 12,
    color: '#007bff',
  },
  nameCell: {
    flex: 7,
  },
  valueCell: {
    flex: 3,
    textAlign: 'center',
    fontSize: 14,
  },
  formContainer: {
    marginVertical: 20,
  },
  formLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginVertical: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  errorBorder: {
    borderColor: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  hiddenField: {
    display: 'none',
  },
  required: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
