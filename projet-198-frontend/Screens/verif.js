import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator ,KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import config from '../config'; // adjust the path if needed
const SMSCodeInput = ({ route, navigation }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  
  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      const formattedPhoneNumber = "+216" + route.params.phoneNumber;
      const response = await axios.post(`${config.SERVER_URL}/users/verify`, { phoneNumber: formattedPhoneNumber, verificationCode: code });
      setLoading(false);
      Alert.alert('Success', response.data.msg);
      navigation.navigate('Coordonnées', { phoneNumber: route.params.phoneNumber });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.response.data.msg);
      console.error(error);
    }
  }; 

  const handleResendCode = async () => {
    try {
      const formattedPhoneNumber = "+216" + route.params.phoneNumber;
      setLoading(true);
      // Envoyer une nouvelle demande pour le code de vérification
      const response = await axios.post('http://172.20.10.2:4000/users/send-verification-code', { telephone: formattedPhoneNumber }); //le numero de telephone a ete envoyé depuis SignUP.js
      setLoading(false);
      Alert.alert('Success', response.data.msg);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.response.data.msg);
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
    <View style={styles.container}>
      <Text style={styles.title}>Code de Vérification</Text>
      <Text style={styles.text1}>Nous avons envoyé le code de vérification à votre numéro de téléphone.</Text>
      <TextInput
        style={styles.input}
        placeholder="Code de vérification"
        keyboardType="numeric"
        onChangeText={setCode}
        value={code}
      />
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
        <Text style={styles.buttonText}>Vérifier le code</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}>
        <Text style={styles.buttonText}>Renvoyer le code</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    color: 'red',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 10,
  },
  resendButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text1: {
    color: 'grey',
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: 'blue', // couleur de fond du bouton
    paddingHorizontal: 20, // espacement horizontal à gauche et à droite
    paddingVertical: 10, // espacement vertical en haut et en bas
    borderRadius: 8, // bordure arrondie
    marginTop: 20, // marge en haut du bouton
  },
  
});

export default SMSCodeInput;
