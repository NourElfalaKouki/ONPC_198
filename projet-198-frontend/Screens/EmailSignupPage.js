import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import axios from 'axios';
import { SERVER_URL } from '../config';  // Ensure this is correctly imported

const EmailSignupPage = ({ navigation }) => {
  const [email, setEmail] = useState('');

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendVerificationEmail = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse e-mail.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Erreur', 'Adresse e-mail invalide.');
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/users/send-verification-email`, {
        email,
      });
      Alert.alert('Succès', response.data.msg || 'Le code a été envoyé à votre adresse email.');
      navigation.navigate('EmailVerification', { email });
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', error?.response?.data?.msg || 'Une erreur est survenue.');
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
          placeholder="Adresse e-mail"
          style={styles.input}
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.nextButton} onPress={handleSendVerificationEmail}>
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
        
        <Text style={styles.linkText}>
  J'ai déjà un compte..{" "}
  <Text 
    style={styles.link} 
    onPress={() => navigation.navigate('Connexion')} 
  >
    Se connecter
  </Text>
</Text>
      </View>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  linkText: {
    marginVertical: 10,
    textAlign: 'center',
  },
  link: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
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

export default EmailSignupPage;
