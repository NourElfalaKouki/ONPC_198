import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from 'react-native';
import logo from '../assets/images/logo-ONPC.png'; // ????????????

const StartPage = ({ navigation }) => {
  const scaleValue = new Animated.Value(1);

  const startAnimation = () => {
    Animated.timing(scaleValue, {
      toValue: 1.1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <ImageBackground source={require('../assets/images/logo-ONPC.png')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <Animated.Text style={[styles.logoText, { transform: [{ scale: scaleValue }] }]}>198</Animated.Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            startAnimation();
            navigation.navigate('Connexion');
          }}
        >
          <Text style={styles.buttonText}>Commencer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(1, 0, 0, .6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 50,
    textShadowColor: 'rgba(0, 0, 0, 6)',
    textShadowOffset: { width: 5, height: 3 },
    textShadowRadius: 5,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default StartPage;