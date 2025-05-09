import React, { useState } from 'react';
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Modal, 
  View, 
  FlatList,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const CoordonneesInput = ({ route, navigation }) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [selectedGouvernorat, setSelectedGouvernorat] = useState('');
  const [selectedDelegation, setSelectedDelegation] = useState('');
  const [modalGouvernoratVisible, setModalGouvernoratVisible] = useState(false);
  const [modalDelegationVisible, setModalDelegationVisible] = useState(false);

  const delegations = {
    'Ariana': ['Ariana Ville', 'Ettadhamen', 'Kalaat Landlous', 'La soukra', 'Mnihla', 'Raoued', 'Sidi Thabet'],
    'Béja': ['Amdoun', 'Béja Nord', 'Béja sud', 'Goubellat', 'Mejez El Bab', 'Nefza', 'Teboursouk', 'Testour', 'Thibar', 'Joumine', 'Sejnane'],
    'Ben Arous': ['Ben Arous', 'Bou Mhel El Bassatine', 'El Mourouj', 'Ezzahra', 'Fouchana', 'Hammam Chatt', 'Hammam Lif', 'Megrine', 'Mohamadia', 'Mornag', 'Nouvelle Medina', 'Rades'],
    'Bizerte': ['Bizerte Nord ', 'Bizerte sud', 'El Alia', 'Ghar El Melh', 'Ghezala', 'Jarzouna', 'Mateur', 'Menzel Bourguiba', 'Menzel Jemil', 'Ras Jbel', 'Tinja', 'Utique', 'AOUSJA', 'LA PECHERIE'],
    'Gabès': ['El Hamma', 'El Metouia', 'Gabes Medina', 'Gabes Ouest', 'Gabes Sud', 'Ghannouch', 'Mareth', 'Metmata', 'Menzel Habib', 'Nouvelle Matmata'],
    'Gafsa': ['Belkhir', 'El Guattar', 'El ksar', 'El mdhihla', 'Gafsa Nord', 'Gafsa Sud', 'Metlaoui', 'Moulares', 'Redeyef', 'Sidi Aich', 'Sned'],
    'Jendouba': ['Ain Drahem', 'Balta Bou Aouene', 'Bou Salem', 'Fernana', 'Ghardimaou', 'Jendouba', 'Jendouba Nord', 'Oued Mliz', 'Tabarka'],
    'Kairouan': ['Bou Hajla', 'Chebika', 'Cherada', 'El Ala', 'Haffouz', 'Hajeb EL ayoun', 'Kairouan Nord', 'Kairouan Sud', 'Nasrallah', 'Oueslatia', 'Sbikha'],
    'Kasserine': ['El Ayoun', 'Ezzouhour (Kasserine)', 'Feriana', 'Foussana', 'Haidra', 'Hassi El Frid', 'Jediliane', 'Kasserine Nord', 'Mejel Bel Abbes', 'Sbeitla', 'sbiba', 'Thala', 'Kasserine Sud'],
    'Kébili': ['Douz', 'El Faouar', 'Kebili Nord', 'Kebili Sud', 'Souk El Ahad'],
    'Le Kef': ['Dahmani', 'El Ksour', 'Jerisa', 'Kalaa ElKhasba', 'Kalaat Sinane', 'Le Kef Est', 'Le Kef Ouest', 'Nebeur', 'Sakiet Sidi Youssef', 'Tajerouine', 'Touiref', 'Le Sers'],
    'Mahdia': ['Bou Merdes', 'Chorbane', 'El Jem', 'Hbira', 'Ksour Essaf', 'La Chebba', 'Mahdia', 'Melloulech', 'Ouled Chamakh', 'Sidi Alouane', 'Souassi'],
    'La Manouba': ['Borj El Amri', 'El Battan', 'Jedaida', 'Mannouba', 'Mornaguia', 'Oued Ellil', 'Tebourba', 'Douar Hicher'],
    'Médenine': ['Ajim', 'Ben Guerdane', 'Beni Khedache', 'Houmet Essouk', 'Medenine Nord', 'Medenine Sud', 'Midoun', 'Sidi Makhlouf', 'Zarzis'],
    'Monastir': ['Bekalta', 'Bembla', 'Beni Hassen', 'Jemmal','Ksar Helal', 'Ksibet El Mediouni', 'Monastir', 'Ouerdanine', 'Sahline', 'Sayada Lamta Bou Hjar', 'Teboulba', 'Zeramdine', 'Moknine'],
    'Nabeul': ['Beni Khalled', 'Beni Khiar', 'Bou Argoub', 'Dar Chaabane Elfehri', 'El Haouaria', 'EL Mida', 'Grombalia', 'Hammam El Ghezaz', 'Hammamet', 'Kelibia', 'Korba', 'Menzel Bouzelfa', 'Menzel Temime', 'Nabeul', 'Soliman', 'Takelsa'],
    'Sfax': ['Agareb', 'Bor Ali Ben Khelifa', 'El Amra', 'El Hencha', 'Esskhira', 'Ghraiba', 'Jebeniana', 'Karkenah', 'Mahras', 'Menzel chaker', 'Sakiet Eddaier', 'Sakiet Ezzit', 'Sfax Est', 'Sfax Sud', 'Sfax Ville'],
    'Sousse': ['Akouda', 'Bou Ficha', 'Enfidha', 'Hammam Sousse', 'Hergla', 'Kalaa Essghira', 'Kondar', 'Msaken', 'Sidi Bou Ali', 'Sidi El Heni', 'Sousse Jaouhara', 'Sousse Riadh', 'Sousse Ville'],
    'Siliana': ['Bargou', 'Bou Arada', 'El Aroussa', 'Gaafour', 'Kesra', 'Le Krib', 'Makthar', 'Rohia', 'Sidi Bou Rouis', 'Siliana Nord', 'Siliana Sud'],
    'Sidi Bouzid': ['Ben Oun', 'Bir El Haffey', 'Cebbala', 'Jilma', 'Maknassy', 'Menzel Bouzaiene', 'Mezzouna', 'Ouled Haffouz', 'Regueb', 'Sidi Bouzid Est', 'Sidi Bouzid Ouest', 'Souk Jedid'],
    'Tataouine': ['Bir Lahmar', 'Dhehiba', 'Ghomrassen', 'Remada', 'Smar', 'Tataouine Nord', 'Tataouine Sud'],
    'Tozeur': ['Degueche', 'Hezoua', 'Nefta', 'Tameghza', 'Tozeur'],
    'Tunis': ['Bab Bhar', 'Bab Souika', 'Carthage', 'Cite El Khadra', 'El Hrairia', 'El Kabbaria', 'El Kram', 'El Menzah', 'El Omrane', 'El Omrane Superieur', 'El Ouerdia', 'Essijoumi', 'Ettahrir', 'Ezzouhour (Tunis)', 'Jebel Jelloud', 'La Goulette', 'La Marsa', 'La Medina', 'Le Bardo', 'Sidi El Bechir', 'Sidi Hassine', 'Tunis'],
    'Zaghouan': ['Bir Mcherga', 'El Fahs', 'Ennadhour', 'Hammam Zriba', 'Saoued', 'Zaghouan'],
  };

  const translateY = useSharedValue(0);
  const modalHeight = useSharedValue(400);

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      height: modalHeight.value,
    };
  });

  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationY > 0) {
      translateY.value = event.nativeEvent.translationY;
    }
  };

  const onGestureEnd = () => {
    if (translateY.value > 50) {
      modalHeight.value = withSpring(0);
      setTimeout(() => {
        setModalGouvernoratVisible(false);
        setModalDelegationVisible(false);
        modalHeight.value = 400;
        translateY.value = 0;
      }, 300);
    } else {
      translateY.value = withSpring(0);
    }
  };

  const handleSuivant = () => {
    if (!nom.trim() || !prenom.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom complet');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateDeNaissance)) {
      Alert.alert('Erreur', 'Format de date invalide (AAAA-MM-JJ)');
      return;
    }

    if (!selectedGouvernorat || !selectedDelegation) {
      Alert.alert('Erreur', 'Veuillez sélectionner votre localisation');
      return;
    }

    if (!/^\d{4}$/.test(codePostal)) {
      Alert.alert('Erreur', 'Code postal invalide (4 chiffres requis)');
      return;
    }

    navigation.navigate('Password', {
      ...route.params,
      nom,
      prenom,
      dateDeNaissance,
      gouvernorat: selectedGouvernorat,
      delegation: selectedDelegation,
      codePostal
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardDismissMode="on-drag"
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.innerContainer}>
              <Text style={styles.title}>Informations personnelles</Text>

              <TextInput
                placeholder="Nom"
                placeholderTextColor="#666"
                style={styles.input}
                value={nom}
                onChangeText={setNom}
              />

              <TextInput
                placeholder="Prénom"
                placeholderTextColor="#666"
                style={styles.input}
                value={prenom}
                onChangeText={setPrenom}
              />

              <TextInput
                placeholder="Date de naissance (AAAA-MM-JJ)"
                placeholderTextColor="#666"
                style={styles.input}
                value={dateDeNaissance}
                onChangeText={setDateDeNaissance}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
              />

              <TouchableOpacity 
                style={styles.input} 
                onPress={() => setModalGouvernoratVisible(true)}
              >
                <Text style={selectedGouvernorat ? styles.inputText : styles.placeholder}>
                  {selectedGouvernorat || 'Sélectionnez un gouvernorat'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.input, !selectedGouvernorat && styles.disabled]} 
                onPress={() => selectedGouvernorat && setModalDelegationVisible(true)}
                disabled={!selectedGouvernorat}
              >
                <Text style={selectedDelegation ? styles.inputText : styles.placeholder}>
                  {selectedDelegation || 'Sélectionnez une délégation'}
                </Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Code postal"
                placeholderTextColor="#666"
                style={styles.input}
                value={codePostal}
                onChangeText={setCodePostal}
                keyboardType="number-pad"
                maxLength={4}
              />

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSuivant}
              >
                <Text style={styles.buttonText}>Continuer</Text>
              </TouchableOpacity>

              <Modal
                animationType="fade"
                transparent={true}
                visible={modalGouvernoratVisible || modalDelegationVisible}
                onRequestClose={() => {
                  setModalGouvernoratVisible(false);
                  setModalDelegationVisible(false);
                }}
              >
                <View style={styles.modalOverlay}>
                  <PanGestureHandler
                    onGestureEvent={onGestureEvent}
                    onEnded={onGestureEnd}
                  >
                    <Animated.View style={[styles.modalContent, modalStyle]}>
                      <View style={styles.handleBar} />
                      <FlatList
                        data={modalGouvernoratVisible 
                          ? Object.keys(delegations) 
                          : delegations[selectedGouvernorat] || []}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.modalItem}
                            onPress={() => {
                              if (modalGouvernoratVisible) {
                                setSelectedGouvernorat(item);
                                setModalGouvernoratVisible(false);
                                setModalDelegationVisible(true);
                              } else {
                                setSelectedDelegation(item);
                                setModalDelegationVisible(false);
                              }
                            }}
                          >
                            <Text style={styles.modalText}>{item}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </Animated.View>
                  </PanGestureHandler>
                </View>
              </Modal>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    color: '#FF0000',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  input: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputText: {
    color: '#333',
    fontSize: 16,
  },
  placeholder: {
    color: '#666',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  button: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingTop: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CoordonneesInput;