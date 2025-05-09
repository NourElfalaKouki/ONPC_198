import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import { SERVER_URL } from '../config';


const LoginPage = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [mdp, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!identifier || !mdp) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
      }

      setLoading(true);
      
      // Determine identifier type and format phone number
      let loginData;
      if (identifier.includes('@')) {
        loginData = { email: identifier, mdp };
      } else {
        const phone = identifier.startsWith('+216') ? identifier : `+216${identifier}`;
        loginData = { telephone: phone, mdp };
      }

      const response = await fetch(`${SERVER_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Directly use the user ID from login response
        navigation.navigate('Acceuil', { userId: data.user.id });
      } else {
        const errorMsg = data.msg || data.message || 'Échec de la connexion';
        Alert.alert('Erreur', errorMsg);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Problème de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/images/logo-ONPC.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Connexion</Text>

        <TextInput
          placeholder="Email ou numéro de téléphone"
          placeholderTextColor="#666"
          style={styles.input}
          keyboardType="default"
          autoCapitalize="none"
          onChangeText={setIdentifier}
          value={identifier}
        />

        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#666"
          style={styles.input}
          secureTextEntry={true}
          value={mdp}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Chargement...' : 'Se connecter'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.linkText}>
          <Text 
            style={styles.link} 
            onPress={() => navigation.navigate('Inscription')}
          >
            Créer un compte
          </Text>
        </Text>

        <Text style={styles.linkText}>
          <Text 
            style={styles.link} 
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Mot de passe oublié ?
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
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
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
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    height: 50,
    width: '100%',
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
    marginVertical: 10,
    textAlign: 'center',
  },
  link: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default LoginPage;