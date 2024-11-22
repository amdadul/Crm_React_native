import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
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
import {resetPasswordApi, sendOtpApi, verifyOtpApi} from '../api/PublicApi'; // Your API methods

export default function ForgotPasswordScreen() {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm();

  const navigation = useNavigation();

  // Step 1: Send OTP
  const sendOTP = async data => {
    try {
      const phone = data.phone_number;
      const response = await sendOtpApi(phone, 5, 1); // Replace with your API
      if (response.success) {
        Toast.show({type: 'success', text1: 'OTP sent successfully!'});
        setOtpSent(true);
      } else {
        Toast.show({type: 'error', text1: response.error});
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Step 2: Verify OTP
  const verifyOTP = async data => {
    try {
      const response = await verifyOtpApi(data.phone_number, data.otp, 5, 1); // Replace with your API
      if (response.success) {
        Toast.show({type: 'success', text1: 'OTP verified successfully!'});
        setOtpVerified(true);
      } else {
        Toast.show({type: 'error', text1: response.error});
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Step 3: Reset Password
  const resetPassword = async data => {
    try {
      const response = await resetPasswordApi(
        data.phone_number,
        data.password,
        data.confirm_password,
        5,
      ); // Replace with your API
      if (response.success) {
        Toast.show({type: 'success', text1: 'Password reset successfully!'});
        navigation.navigate('Login');
      } else {
        Toast.show({type: 'error', text1: response.error});
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {!otpSent && (
        // Step 1: Phone Number and OTP Send
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <Controller
            control={control}
            name="phone_number"
            rules={{required: 'Phone number is required'}}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={[
                  styles.inputText,
                  errors.phone_number && styles.errorInput,
                ]}
                placeholder="Enter your phone number"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.phone_number && (
            <Text style={styles.errorText}>{errors.phone_number.message}</Text>
          )}
          <View style={styles.btn}>
            <Button title="Send OTP" onPress={handleSubmit(sendOTP)} />
          </View>
        </View>
      )}

      {otpSent && !otpVerified && (
        // Step 2: OTP Input and Verification
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>OTP</Text>
          <Controller
            control={control}
            name="otp"
            rules={{required: 'OTP is required'}}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={[styles.inputText, errors.otp && styles.errorInput]}
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
          <View style={styles.btn}>
            <Button title="Verify OTP" onPress={handleSubmit(verifyOTP)} />
          </View>
        </View>
      )}

      {otpVerified && (
        // Step 3: New Password and Confirm Password
        <View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.password && styles.errorInput,
                      styles.flexInput,
                    ]}
                    placeholder="Enter new password"
                    secureTextEntry={!showNewPassword}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <TouchableOpacity
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
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="confirm_password"
                rules={{
                  required: 'Confirm password is required',
                  validate: value =>
                    value === control._formValues.password ||
                    'Passwords do not match',
                }}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.confirm_password && styles.errorInput,
                      styles.flexInput,
                    ]}
                    placeholder="Confirm new password"
                    secureTextEntry={!showConfirmPassword}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            {errors.confirm_password && (
              <Text style={styles.errorText}>
                {errors.confirm_password.message}
              </Text>
            )}
          </View>
          <View style={styles.btn}>
            <Button
              title="Set New Password"
              onPress={handleSubmit(resetPassword)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  input: {
    padding: 10,
    flex: 1,
    borderRadius: 5,
  },
  inputText: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  flexInput: {
    flex: 1,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  btn: {
    marginTop: 20,
  },
});
