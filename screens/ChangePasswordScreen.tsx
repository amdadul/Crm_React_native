import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {changePasswordApi, changePasswordVerifyApi} from '../api/CrmApi';
import {sendOtpApi, verifyOtpApi} from '../api/PublicApi';

export default function ChangePasswordScreen() {
  const [otpSent, setOtpSent] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    control,
    handleSubmit,
    trigger,
    setError,
    formState: {errors},
  } = useForm();

  const navigation = useNavigation();

  const sendOTP = async data => {
    try {
      const isValid = await trigger(['old_password', 'password', 'c_password']);
      if (!isValid) {
        Alert.alert('Validation Error', 'Please fix the errors in the form.');
        return;
      }

      const verify = await changePasswordVerifyApi(data);
      if (verify.success) {
        const phone = await AsyncStorage.getItem('userPhone');
        const sentOtpRes = await sendOtpApi(phone, 5, 1);
        if (sentOtpRes.success) {
          Toast.show({
            type: 'success',
            text1: 'An OTP has been sent to your registered number.',
          });
          setOtpSent(true);
        } else {
          Toast.show({
            type: 'error',
            text1: sentOtpRes.error,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: verify.error,
        });
      }
    } catch (error) {
      setError('currentPassword', {message: error.message});
      Alert.alert('Error', error.message);
    }
  };

  const changePassword = async data => {
    try {
      const mediumString = await AsyncStorage.getItem('userPhone');
      const medium = mediumString ? parseInt(mediumString, 10) : null;

      if (!medium || isNaN(medium)) {
        throw new Error('Invalid phone number format.');
      }
      const otpValidRes = await verifyOtpApi(medium, data.otp, 5, 1);
      if (otpValidRes.success) {
        const cngPassRes = await changePasswordApi(data);
        if (cngPassRes.success) {
          Toast.show({
            type: 'success',
            text1: cngPassRes.data.message,
          });
          navigation.navigate('AppTabs', {screen: 'Home'});
        } else {
          Toast.show({
            type: 'error',
            text1: cngPassRes.error,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: otpValidRes.error,
        });
      }
    } catch (error) {
      setError('otp', {message: error.message});
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            name="old_password"
            rules={{required: 'Current password is required'}}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={[styles.input, errors.old_password && styles.errorInput]}
                placeholder="Enter your current password"
                secureTextEntry={!showCurrentPassword}
                value={value}
                onChangeText={onChange}
                editable={!otpSent}
              />
            )}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
            <Ionicons
              name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.old_password && (
          <Text style={styles.errorText}>{errors.old_password.message}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'New Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
            }}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={[styles.input, errors.password && styles.errorInput]}
                placeholder="Enter your new password"
                secureTextEntry={!showNewPassword}
                value={value}
                onChangeText={onChange}
                editable={!otpSent}
              />
            )}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowNewPassword(!showNewPassword)}>
            <Ionicons
              name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            name="c_password"
            rules={{
              required: 'Confirm Password is required',
              validate: value =>
                value === control._formValues.password ||
                'Passwords do not match',
            }}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={[styles.input, errors.c_password && styles.errorInput]}
                placeholder="Re-enter your new password"
                secureTextEntry={!showConfirmPassword}
                value={value}
                onChangeText={onChange}
                editable={!otpSent}
              />
            )}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.c_password && (
          <Text style={styles.errorText}>{errors.c_password.message}</Text>
        )}
      </View>

      {!otpSent && <Button title="Send OTP" onPress={handleSubmit(sendOTP)} />}

      {otpSent && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>OTP</Text>
          <Controller
            control={control}
            name="otp"
            rules={{required: 'OTP is required'}}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={[styles.inputOtp, errors.otp && styles.errorInput]}
                placeholder="Enter the OTP"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.otp && (
            <Text style={styles.errorText}>{errors.otp.message}</Text>
          )}
          <View style={styles.changeBtn}>
            <Button
              title="Verify OTP & Change Password"
              onPress={handleSubmit(changePassword)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  changeBtn: {
    paddingTop: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f7f8fa',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    paddingRight: 10,
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  inputOtp: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  eyeButton: {
    paddingHorizontal: 5,
  },
});
