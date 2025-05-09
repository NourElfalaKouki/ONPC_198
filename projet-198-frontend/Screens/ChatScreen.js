import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, KeyboardAvoidingView, Image, TouchableOpacity, Platform } from 'react-native';
import ChatInputBar from './ChatInputBar';
import { Audio } from 'expo-av';
import io from 'socket.io-client';
import { Ionicons } from '@expo/vector-icons';
import { SERVER_URL } from '../config';

const ChatScreen = ({ route }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketInstance = io(SERVER_URL);
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    const { userId } = route.params;
    socketInstance.emit('register', userId);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (message) => {
      if (message.isFromCurrentUser) return;
      setMessages(prev => [
        { ...message, isUser: false, timestamp: new Date(), status: 'delivered' },
        ...prev
      ]);
    };

    socket.on('sendMessageToMobile', handleIncoming);
    socket.on('sendImageToMobile', handleIncoming);
    socket.on('sendAudioToMobile', handleIncoming);

    return () => {
      socket.off('sendMessageToMobile', handleIncoming);
      socket.off('sendImageToMobile', handleIncoming);
      socket.off('sendAudioToMobile', handleIncoming);
    };
  }, [socket]);

  const sendMessageToServer = (text) => {
    if (!socket) return;
    const { userId } = route.params;
    const msg = { text, isUser: true, timestamp: new Date(), status: 'sent' };
    setMessages(prev => [msg, ...prev]);
    socket.emit('message', { text, userId, isFromCurrentUser: true });
  };

  const handleSendImageMessage = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('image', { uri: imageUri, name: `img_${Date.now()}.jpg`, type: 'image/jpeg' });
      const res = await fetch(`${SERVER_URL}/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error();
      const url = await res.text();

      const msg = {
        localUri: imageUri,
        uri: url,
        isImage: true,
        isUser: true,
        timestamp: new Date(),
        status: 'sent'
      };
      setMessages(prev => [msg, ...prev]);
      socket.emit('sendImageData', { url, isFromCurrentUser: true });
    } catch (e) { console.error(e); }
  };

  const handleSendVoiceMessage = async (audioUri) => {
    try {
      const { sound, status } = await Audio.Sound.createAsync({ uri: audioUri });
      const durMs = status.durationMillis || 0;
      await sound.unloadAsync();
      const sec = Math.round(durMs / 1000);
      const mins = Math.floor(sec / 60);
      const secs = sec % 60;
      const duration = `${mins}:${secs.toString().padStart(2,'0')}`;

      const formData = new FormData();
      formData.append('audio', { uri: audioUri, name: `aud_${Date.now()}.mp3`, type: 'audio/mpeg' });
      const res = await fetch(`${SERVER_URL}/uploadAudio`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error();
      const url = await res.text();

      const msg = {
        localUri: audioUri,
        uri: url,
        isVoice: true,
        isUser: true,
        timestamp: new Date(),
        status: 'sent',
        duration
      };
      setMessages(prev => [msg, ...prev]);
      socket.emit('sendAudioData', { url, isFromCurrentUser: true, duration });
    } catch (e) { console.error(e); }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.containerMsg, item.isUser ? styles.userPos : styles.serverPos]}>  
      {item.isImage ? (
        <View style={[styles.bubble, styles.imageBubble]}>
          <Image
            style={styles.image}
            source={{ uri: item.isUser ? item.localUri : item.uri }}
          />
        </View>
      ) : item.isVoice ? (
        <TouchableOpacity
          style={[styles.bubble, styles.voiceBubble, item.isUser && styles.userBubble]}
          onPress={() => Audio.Sound.createAsync({ uri: item.isUser ? item.localUri : item.uri }).then(r => r.sound.playAsync())}
        >
          <Ionicons name="play" size={20} color={item.isUser? '#fff':'#c00'} />
          <Text style={[styles.duration, item.isUser? styles.userText:styles.serverText]}> {item.duration} </Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.bubble, item.isUser? styles.userBubble:styles.serverBubble]}>
          <Text style={[styles.text, item.isUser? styles.userText:styles.serverText]}> {item.text} </Text>
        </View>
      )}
      <Text style={styles.time}> {item.timestamp.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })} </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={styles.flex} keyboardVerticalOffset={90}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_,i)=>i.toString()}
          inverted
          contentContainerStyle={styles.list}
        />
        <ChatInputBar
          onSendTextMessage={sendMessageToServer}
          onSendImageMessage={handleSendImageMessage}
          onSendVoiceMessage={handleSendVoiceMessage}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#fff'},
  flex:{flex:1},
  list:{padding:16},
  containerMsg:{marginVertical:6},
  userPos:{alignSelf:'flex-end'},
  serverPos:{alignSelf:'flex-start'},
  bubble:{padding:12,borderRadius:16,maxWidth:'80%',shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:4,elevation:2},
  userBubble:{backgroundColor:'#c00',borderBottomRightRadius:4},
  serverBubble:{backgroundColor:'#eee',borderBottomLeftRadius:4},
  imageBubble:{padding:0,overflow:'hidden'},
  image:{width:200,height:200,borderRadius:12},
  voiceBubble:{flexDirection:'row',alignItems:'center',gap:6},
  text:{fontSize:16},
  userText:{color:'#fff'},
  serverText:{color:'#333'},
  duration:{fontSize:14},
  time:{fontSize:10,color:'#666',marginTop:4}
});

export default ChatScreen;