import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import io from 'socket.io-client';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
import { SERVER_URL } from '@/config';

const HomePage = ({ route, navigation }) => {
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const socketInstance = io(SERVER_URL);
    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const locationWatch = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000 },
        (newLocation) => setLocation(newLocation.coords)
      );

      return () => locationWatch?.remove();
    })();
  }, []);

  useEffect(() => {
    const sendLocationToServer = async (coords) => {
      try {
        await axios.post(`${SERVER_URL}users/updateLocation`, {
          userId: route.params.userId,
          latitude: coords.latitude,
          longitude: coords.longitude
        });
      } catch (error) {
        console.error('Location update failed:', error);
      }
    };

    if (location) sendLocationToServer(location);
  }, [location]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.post(`${SERVER_URL}users/getUserData`, {
          userId: route.params.userId
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    getUserData();
  }, []);

  const handleChat = () => {
    navigation.navigate('Chat', { userId: route.params.userId });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="menu-outline" size={28} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile', { userId: route.params.userId })}
        >
          <Image
            source={require('../assets/images/user.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Full-screen Map */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        ) : (
          <Text style={styles.loadingText}>
            {errorMsg || 'Loading your location...'}
          </Text>
        )}
      </View>

      {/* Floating Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.chatButton]}
          onPress={handleChat}
        >
          <Icon name="chatbubble-ellipses" size={20} color="#fff" />
          <Text style={styles.buttonText}>Messagerie</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.emergencyButton]}>
          <Icon name="alert-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>Urgence 198</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home', { userId: route.params.userId })}
        >
          <Icon name="home" size={24} color="#FF0000" />
          <Text style={styles.navLabelActive}>Accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile', { userId: route.params.userId })}
        >
          <Icon name="person" size={24} color="#666" />
          <Text style={styles.navLabel}>Profil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Guide', { userId: route.params.userId })}
        >
          <Icon name="book" size={24} color="#666" />
          <Text style={styles.navLabel}>Guide</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: width * 0.4,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chatButton: {
    backgroundColor: '#4CAF50',
  },
  emergencyButton: {
    backgroundColor: '#FF4444',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  navLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  navLabelActive: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: '50%',
    color: '#666',
  },
});

export default HomePage;