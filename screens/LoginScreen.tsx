import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAuth} from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const {login} = useAuth();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (e) {
      console.error('Login failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneContainer}>
        <Image
          source={require('../assets/oneplus_logo.png')}
          style={styles.phoneImage}
        />
      </View>

      <Text style={styles.header}>Login</Text>

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Phone number"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={[styles.input, errors.email && {borderColor: 'red'}]}
            keyboardType="phone-pad"
          />
        )}
        name="email"
        rules={{
          required: 'Phone number is required',
          pattern: {
            value: /^[0-9]{11}$/, // Adjust regex for your phone number format
            message: 'Please enter a valid phone number',
          },
        }}
        defaultValue=""
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            style={[styles.input, errors.password && {borderColor: 'red'}]}
          />
        )}
        name="password"
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters long',
          },
        }}
        defaultValue=""
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: isLoading ? 'gray' : '#007bff'},
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.link}>Sign Up</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  phoneContainer: {
    alignItems: 'center',
    marginBottom: 30, // Space between the phone icon and the form
  },
  phoneImage: {
    width: 250,
    height: 140,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
