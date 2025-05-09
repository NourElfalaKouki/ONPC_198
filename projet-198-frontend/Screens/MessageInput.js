import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageItem = ({ message, isUser }) => {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.otherBubble]}>
        <Text style={[styles.text, isUser && styles.userText]}>{message.text}</Text>
        
        <View style={styles.footer}>
          <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isUser && (
            <Ionicons 
              name={message.status === 'read' ? 'checkmark-done' : 'checkmark'} 
              size={12} 
              color={message.status === 'read' ? '#7FB3D5' : '#A9A9A9'}
              style={styles.statusIcon}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#7FB3D5', // Soft blue
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#F0F0F0', // Light grey
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  userText: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginRight: 4,
  },
  userTimestamp: {
    color: '#FFFFFFCC',
  },
  statusIcon: {
    marginLeft: 4,
  },
});

export default MessageItem;