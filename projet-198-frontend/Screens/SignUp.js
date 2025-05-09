import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '../config';

const SignupPage = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (number) => {
    return /^[9245]\d{7}$/.test(number); // 8 digits starting with 9/2/4/5
  };

  const handleNext = async () => {
    try {
      // Basic validation
      if (!phoneNumber || phoneNumber.length !== 8) {
        Alert.alert('Invalid Number', 'Please enter 8-digit phone number');
        return;
      }

      if (!validatePhoneNumber(phoneNumber)) {
        Alert.alert('Invalid Number', 'Number must start with 9, 2, 4, or 5');
        return;
      }

      setLoading(true);
      const formattedPhoneNumber = "+216" + phoneNumber;
      
      const response = await axios.post(`${SERVER_URL}/users/send-verification-code`, { 
        telephone: formattedPhoneNumber
      });

      navigation.navigate('Vérification', { 
        phoneNumber: formattedPhoneNumber // Send formatted number with country code
      });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Créer un compte</Text>

        <TextInput
          placeholder="Numéro de téléphone"
          placeholderTextColor="#666"
          style={styles.input}
          keyboardType="phone-pad"
          onChangeText={text => setPhoneNumber(text.replace(/[^0-9]/g, ''))} // Only allow numbers
          value={phoneNumber}
          maxLength={8}
          autoFocus
        />

        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Chargement...' : 'Suivant'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Vous voulez utiliser votre adresse mail ?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate('EmailSignup')}
          >
            Utiliser votre mail
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    color: 'red',
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextButton: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  signupLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default SignupPage;