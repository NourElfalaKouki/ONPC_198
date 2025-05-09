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

const CreatePasswordScreen = ({ route, navigation }) => {
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

  const handleSubmit = async () => {
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
      telephone, // will be either '+216xxxx' or null
    };
    
    try {
      setLoading(true);
      // Register and get back userId in one call
      const response = await axios.post(
        `${SERVER_URL}/users/register`,
        userData
      );
      const { userId } = response.data;
      console.log(userId);
      // Navigate directly with the new ID
      navigation.reset({
        index: 0,
        routes: [{ name: 'Acceuil', params: { userId } }],
      });
    } catch (error) {
      console.log('Registration error payload:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const msg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        'Échec de l\'inscription';
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Créer un mot de passe</Text>

        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#666"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Confirmer le mot de passe"
          placeholderTextColor="#666"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Chargement...' : 'Finaliser l\'inscription'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    justifyContent: 'center',
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
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});

export default CreatePasswordScreen;
