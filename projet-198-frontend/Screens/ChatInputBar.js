import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

const ChatInputBar = ({ onSendTextMessage, onSendVoiceMessage, onSendImageMessage }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [duration, setDuration] = useState(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    const requestPermissions = async () => {
      await Audio.requestPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      setDuration(0);
    };
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true })
        ])
      ).start();
    }
  }, [isRecording]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error('Recording failed to start', error);
    }
  };

  const submitRecording = async () => {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      onSendVoiceMessage(uri);
    } finally {
      setRecording(null);
      setIsRecording(false);
      Animated.timing(pulseAnim).stop();
    }
  };

  const discardRecording = async () => {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
    } finally {
      setRecording(null);
      setIsRecording(false);
      Animated.timing(pulseAnim).stop();
    }
  };

  const handleImagePick = async (useCamera = false) => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    };

    try {
      const result = useCamera 
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets[0].uri) {
        onSendImageMessage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image selection failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        {isRecording ? (
          <>
            <Animated.View style={[styles.recordingIndicator, { transform: [{ scale: pulseAnim }] }]} />
            <Text style={styles.durationText}>{formatDuration(duration)}</Text>
            <TouchableOpacity style={styles.iconButton} onPress={discardRecording}>
              <Ionicons name="close-circle" size={32} color="#FF0000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={submitRecording}>
              <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.iconButton} onPress={startRecording}>
              <Ionicons name="mic" size={28} color="#FF0000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleImagePick(false)}>
              <Ionicons name="image" size={28} color="#FF0000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleImagePick(true)}>
              <Ionicons name="camera" size={28} color="#FF0000" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={() => {
            if (message.trim()) {
              onSendTextMessage(message.trim());
              setMessage('');
            }
          }}
        >
          <Ionicons name="send" size={24} color={message.trim() ? "#FF0000" : "#CCC"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 28,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 12,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
  recordingIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF0000',
    marginHorizontal: 8,
  },
  durationText: {
    color: '#FF0000',
    marginHorizontal: 8,
    fontWeight: 'bold',
    minWidth: 40,
  },
});

export default ChatInputBar;