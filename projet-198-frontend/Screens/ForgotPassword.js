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
import { SERVER_URL } from '../config';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendVerificationEmail = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Erreur', 'Adresse e-mail invalide');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${SERVER_URL}/users/send-password-reset`, { email });
      
      Alert.alert('Succès', response.data.msg || 'Code envoyé avec succès');
      navigation.navigate('PasswordResetVerification', { email });
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.msg || 'Échec d\'envoi du code');
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
        <Text style={styles.title}>Réinitialisation</Text>

        <TextInput
          placeholder="Adresse e-mail"
          placeholderTextColor="#666"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSendVerificationEmail}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Chargement...' : 'Suivant'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.linkText}>
          <Text 
            style={styles.link} 
            onPress={() => navigation.goBack()}
          >
            Retour à la connexion
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
  button: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
  },
  link: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default ForgotPassword;