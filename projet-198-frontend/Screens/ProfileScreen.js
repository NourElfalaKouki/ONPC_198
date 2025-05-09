import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  TextInput 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_URL } from '../config';

const ProfileScreen = ({ navigation, route }) => {
  const [activeIcon, setActiveIcon] = useState('Profile');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [newDateDeNaissance, setNewDateDeNaissance] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newPoids, setNewPoids] = useState('');
  const [newTaille, setNewTaille] = useState('');
  const [newGroupeSanguin, setNewGroupeSanguin] = useState('');
  const [dateError, setDateError] = useState('');

  const { userId } = route.params;

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/users/getUserData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data) {
        setUserData(data);
        const dateNaissance = new Date(data.dateDeNaissance);
        const formattedDate = `${dateNaissance.getDate()}/${dateNaissance.getMonth() + 1}/${dateNaissance.getFullYear()}`;
        setDateDeNaissance(formattedDate);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDateChange = (text) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    setNewDateDeNaissance(text);
    setDateError(regex.test(text) || text === '' ? '' : 'Format must be YYYY-MM-DD');
  };

  const handleUpdateProfile = async () => {
    if (dateError) return;

    try {
      const response = await fetch(`${SERVER_URL}/users/UpdateProfile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...(newDateDeNaissance && { dateDeNaissance: newDateDeNaissance }),
          ...(newAge && { age: newAge }),
          ...(newPoids && { poids: newPoids }),
          ...(newTaille && { taille: newTaille }),
          ...(newGroupeSanguin && { GroupeSanguin: newGroupeSanguin }),
        }),
      });

      if (response.ok) {
        alert('Profil Mis A Jour Avec Succes!');
        getUserData();
        setIsModalVisible(false);
        setNewDateDeNaissance('');
        setNewAge('');
        setNewPoids('');
        setNewTaille('');
        setNewGroupeSanguin('');
      } else {
        alert('Echec!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsModalVisible(true)}>
          <Icon name="pencil" size={24} color="#FF0000" />
          <Text style={styles.editText}>Éditer Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <View style={styles.profileContainer}>
        <Image source={require('../assets/images/user.png')} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData?.nom} {userData?.prenom}</Text>
          <Text style={styles.userDetail}>Né le: {dateDeNaissance}</Text>
        </View>
      </View>

      {/* Health Info Grid */}
      <View style={styles.healthGrid}>
        <View style={styles.healthItem}>
          <Icon name="calendar" size={24} color="#FF0000" />
          <Text style={styles.healthLabel}>Age</Text>
          <Text style={styles.healthValue}>{userData?.age || '--'}</Text>
        </View>

        <View style={styles.healthItem}>
          <Icon name="water" size={24} color="#FF0000" />
          <Text style={styles.healthLabel}>Groupe Sanguin</Text>
          <Text style={styles.healthValue}>{userData?.GroupeSanguin || '--'}</Text>
        </View>

        <View style={styles.healthItem}>
          <Icon name="speedometer" size={24} color="#FF0000" />
          <Text style={styles.healthLabel}>Poids</Text>
          <Text style={styles.healthValue}>{userData?.poids || '--'} kg</Text>
        </View>

        <View style={styles.healthItem}>
          <Icon name="resize" size={24} color="#FF0000" />
          <Text style={styles.healthLabel}>Taille</Text>
          <Text style={styles.healthValue}>{userData?.taille || '--'} cm</Text>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mettre à jour le profil</Text>

            <TextInput
              style={styles.input}
              placeholder="Date de naissance (YYYY-MM-DD)"
              placeholderTextColor="#666"
              value={newDateDeNaissance}
              onChangeText={handleDateChange}
            />
            {dateError && <Text style={styles.errorText}>{dateError}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Age"
              placeholderTextColor="#666"
              value={newAge}
              onChangeText={setNewAge}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Poids (kg)"
              placeholderTextColor="#666"
              value={newPoids}
              onChangeText={setNewPoids}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Taille (cm)"
              placeholderTextColor="#666"
              value={newTaille}
              onChangeText={setNewTaille}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Groupe Sanguin"
              placeholderTextColor="#666"
              value={newGroupeSanguin}
              onChangeText={setNewGroupeSanguin}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.buttonText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {
            setActiveIcon('Acceuil');
            navigation.navigate('Acceuil', { userId });
          }}
        >
          <Icon 
            name="home" 
            size={24} 
            color={activeIcon === 'Home' ? '#FF0000' : '#666'} 
          />
          <Text style={[styles.navText, activeIcon === 'Home' && styles.activeNavText]}>
            Acceuil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveIcon('Profile')}
        >
          <Icon 
            name="person" 
            size={24} 
            color={activeIcon === 'Profile' ? '#FF0000' : '#666'} 
          />
          <Text style={[styles.navText, styles.activeNavText]}>
            Profil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {
            setActiveIcon('Guide');
            navigation.navigate('Guide', { userId });
          }}
        >
          <Icon 
            name="book" 
            size={24} 
            color={activeIcon === 'Guide' ? '#FF0000' : '#666'} 
          />
          <Text style={[styles.navText, activeIcon === 'Guide' && styles.activeNavText]}>
            Guide
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 16,
    color: '#666666',
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  healthItem: {
    width: '50%',
    padding: 16,
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 14,
    color: '#666666',
    marginVertical: 8,
  },
  healthValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333333',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
  },
  saveButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#FF0000',
    fontWeight: '600',
  },
});

export default ProfileScreen;