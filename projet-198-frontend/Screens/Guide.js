import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, TextInput, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Guide = ({ route, navigation }) => {
  const { userId } = route.params;
  const [activeTab, setActiveTab] = useState('Guide');

  const handlePdfOpen = (pdfPath) => {
    Linking.openURL(pdfPath);
  };

  return (
    <View style={styles.container}>
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#6C6C6C" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Chercher une urgence"
            placeholderTextColor="#6C6C6C"
          />
        </View>
      </View>

      {/* Content List */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {['Incendies', 'Accident', 'Premiers secours', 'Evanouissement'].map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.pdfItem} 
            onPress={() => handlePdfOpen()}
          >
            <Text style={styles.pdfItemText}>{item}</Text>
            <Icon name="chevron-forward" size={20} color="#FF0000" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Acceuil');
            navigation.navigate('Acceuil', { userId });
          }}
        >
          <Icon 
            name="home" 
            size={24} 
            color={activeTab === 'Home' ? '#FF0000' : '#666'} 
          />
          <Text style={[styles.navLabel, activeTab === 'Home' && styles.navLabelActive]}>
            Accueil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Profile');
            navigation.navigate('Profile', { userId });
          }}
        >
          <Icon 
            name="person" 
            size={24} 
            color={activeTab === 'Profile' ? '#FF0000' : '#666'} 
          />
          <Text style={[styles.navLabel, activeTab === 'Profile' && styles.navLabelActive]}>
            Profil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('Guide')}
        >
          <Icon 
            name="book" 
            size={24} 
            color={activeTab === 'Guide' ? '#FF0000' : '#666'} 
          />
          <Text style={[styles.navLabel, activeTab === 'Guide' && styles.navLabelActive]}>
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
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Increased bottom padding for better scroll
  },
  pdfItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pdfItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    fontWeight: '600',
  },
});

export default Guide;