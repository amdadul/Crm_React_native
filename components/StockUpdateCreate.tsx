import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  BackHandler,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {stockUpdateCreateApi} from '../api/CrmApi';

const StockUpdateCreate = () => {
  const {control, handleSubmit, setValue} = useForm();
  const [barCodes, setBarCodes] = useState('');
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  // Handle back button to close camera modal
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isCameraVisible) {
          setIsCameraVisible(false);
          return true; // Prevent default behavior
        }
        return false; // Allow default behavior
      },
    );

    return () => backHandler.remove();
  }, [isCameraVisible]);

  const handleBarcodeScanned = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128'],
    onCodeScanned: codes => {
      const scannedCode = codes[0]?.value;
      if (!barCodes.includes(scannedCode)) {
        const updatedBarCodes = barCodes
          ? `${barCodes},${scannedCode}`
          : scannedCode;
        setBarCodes(updatedBarCodes);
        setValue('serial_no', updatedBarCodes); // Update form value
      } else {
        Toast.show({
          type: 'info',
          text1: 'Duplicate Barcode',
          text2: `The barcode ${scannedCode} is already added.`,
        });
      }
      setIsCameraVisible(false);
    },
  });

  // Get the camera device
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();

  // Request Camera Permission
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera access is required to scan barcodes.
        </Text>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={requestPermission}>
          <Text style={styles.submitButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (device == null) {
    return <Text style={styles.permissionText}>No Camera Available</Text>;
  }

  // Barcode scanning handler

  // Open Camera to scan barcode
  const openCamera = async () => {
    setIsCameraVisible(true);
  };

  // Submit form data
  const onSubmit = async data => {
    const response = await stockUpdateCreateApi(data);

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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Serial No</Text>
      <View style={styles.inputContainer}>
        <Controller
          name="serial_no"
          control={control}
          defaultValue=""
          render={({field: {onChange, value}}) => (
            <TextInput
              style={styles.textInput}
              placeholder="Enter or scan barcodes"
              multiline={true}
              value={barCodes}
              onChangeText={text => {
                setBarCodes(text);
                onChange(text);
              }}
            />
          )}
        />
        <TouchableOpacity style={styles.scanButton} onPress={openCamera}>
          <Icon name="barcode-scan" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Camera Modal */}
      <Modal
        visible={isCameraVisible}
        animationType="slide"
        onRequestClose={() => setIsCameraVisible(false)}>
        <View style={styles.cameraWrapper}>
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            codeScanner={handleBarcodeScanned}
          />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Scan Barcode</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeCameraButton}
          onPress={() => setIsCameraVisible(false)}>
          <Text style={styles.closeCameraText}>Close Camera</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default StockUpdateCreate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: '100%',
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 100,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    padding: 10,
    paddingRight: 50, // To accommodate the scan button
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top', // Ensure text aligns correctly in multiline input
  },
  scanButton: {
    position: 'absolute',
    right: 10,
    height: 40,
    width: 40,
    backgroundColor: '#007bff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: 300,
    height: 220,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    top: '40%', // Center the overlay vertically
    left: '25%', // Center the overlay horizontally
    width: '50%',
    height: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeCameraButton: {
    padding: 15,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    marginBottom: 30,
    alignSelf: 'center',
  },
  closeCameraText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#dc3545',
  },
});
