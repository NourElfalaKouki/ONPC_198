import { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const VoiceMessagePlayer = ({ uri }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <TouchableOpacity onPress={playSound} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#FF0000" />
      <Text style={{ marginLeft: 8 }}>Voice Message</Text>
    </TouchableOpacity>
  );
};
export default VoiceMessagePlayer;