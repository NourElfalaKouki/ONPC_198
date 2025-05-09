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

const ResetPassword = ({ route, navigation }) => {
  const { email, phoneNumber, ...otherParams } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass) =>
    /^(?=.*[A-Z])(?=.*\d|(?=.*[!@#$%^&*(),.?":{}|<>])).{8,}$/.test(pass);

  const formatPhoneNumber = (phone) => {
    if (typeof phone !== 'string' || phone.trim() === '') return null;
    return phone.startsWith('+216') ? phone : `+216${phone}`;
  };

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
    }
    if (!validatePassword(password)) {
      return Alert.alert(
        'Erreur',
        'Le mot de passe doit contenir:\n- 8 caractères minimum\n- 1 majuscule\n- 1 chiffre ou caractère spécial'
      );
    }

    const telephone = formatPhoneNumber(phoneNumber);
    if (!email && !telephone) {
      return Alert.alert('Erreur', 'Email ou téléphone requis');
    }

    const userData = {
      ...otherParams,
      mdp: password,
      email: telephone ? null : email,
      telephone,
    };
    
    try {
      setLoading(true);
      const response = await axios.post(
        `${SERVER_URL}/users/updatepassword`,
        userData
      );
      const { userId } = response.data;

      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile', params: { userId } }],
      });
    } catch (error) {
      console.log('Password reset error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const msg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        'Échec de la réinitialisation du mot de passe';
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Réinitialiser le mot de passe</Text>

        <TextInput
          placeholder="Nouveau mot de passe"
          placeholderTextColor="#666"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Confirmer le nouveau mot de passe"
          placeholderTextColor="#666"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handlePasswordReset}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Chargement...' : 'Réinitialiser le mot de passe'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20 
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    paddingTop: 50, // Fixed padding instead of dynamic centering
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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '600' 
  },
});

export default ResetPassword;