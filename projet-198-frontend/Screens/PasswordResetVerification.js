import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '../config';

const COOLDOWN_SECONDS = 30; //avoiding dos

const PasswordResetVerification = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef(null);

  // start cooldown timer
  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    intervalRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleVerifyEmailCode = async () => {
    if (!code) {
      setErrorMsg('Please enter the code.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${SERVER_URL}/users/reset-password`, {
        email,
        resetCode: code.trim(),
      });
      setLoading(false);
      navigation.navigate('ResetPassword', { email }); 
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.msg || 'An error occurred.');
    }
  };

  const handleResendEmailCode = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/users/send-password-reset`, { email });
      setLoading(false);
      startCooldown();
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Email Verification</Text>
        <Text style={styles.subtext}>
          A verification code has been sent to {email}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter verification code"
          keyboardType="numeric"
          onChangeText={text => {
            setCode(text);
            setErrorMsg('');
          }}
          value={code}
          secureTextEntry={true}
        />
        {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.disabledButton]}
          onPress={handleVerifyEmailCode}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.buttonText}>Verify Code</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.resendButton,
            (loading || cooldown > 0) && styles.disabledButton
          ]}
          onPress={handleResendEmailCode}
          disabled={loading || cooldown > 0}
        >
          <Text style={styles.resendText}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
  },
  inner: {
    width: '90%', maxWidth: 400, alignItems: 'center', padding: 20,
  },
  title: {
    color: 'red', fontSize: 32, fontWeight: 'bold', marginBottom: 10,
  },
  subtext: {
    color: 'grey', textAlign: 'center', marginBottom: 20,
  },
  input: {
    width: '100%', height: 50, borderWidth: 1, borderColor: '#4CAF50',
    borderRadius: 8, textAlign: 'center', fontSize: 20, marginBottom: 5,
  },
  error: {
    color: 'red', marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: '#4CAF50', width: '100%', alignItems: 'center',
    paddingVertical: 12, borderRadius: 8, marginTop: 10,
  },
  resendButton: {
    marginTop: 15,
  },
  buttonText: {
    color: '#fff', fontSize: 16, fontWeight: 'bold',
  },
  resendText: {
    color: '#4CAF50', fontSize: 16, fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default PasswordResetVerification;
