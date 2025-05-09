import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const StartPage = ({ navigation }) => {
  return (
    <View style={styles.overlay}>
      <Image
        style={styles.logo}
        resizeMode="cover"
        source={require('../assets/images/image.png')}
      />
      <Text style={styles.title}>Succès !</Text>
      <Text style={styles.text}>Félicitations! Vous avez été inscrit avec succès</Text>
      <TouchableOpacity
      style={styles.startButton}
      onPress={() => {
        navigation.navigate('Acceuil'); // Rediriger vers l'écran "Chat"
      }}
      >
      <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  logo: {
    transform: [{ scale: 0.4 }],
    width: 170,
    height: 170,
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Inter',
    color: '#000',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: -40,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Poppins',
    color: '#a5a5a5',
    textAlign: 'center',
    width: 200,
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#35AE35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});

export default StartPage;