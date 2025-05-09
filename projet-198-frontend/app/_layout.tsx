import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importation des écrans
import Login from "../Screens/Login.js";
import StartPage from "../Screens/StartPage.js";
import SignUp from "../Screens/SignUp.js";
import verif from "../Screens/verif.js";
import cord from "../Screens/cord.js";
import mdp from "../Screens/mdp.js";
import succ from "../Screens/succ.js";
import ChatScreen from "../Screens/ChatScreen.js";
import HomePage from "../Screens/HomePage.js";
import ProfileScreen from "../Screens/ProfileScreen.js";
import Guide from "../Screens/Guide.js";
import EmailSignupPage from "../Screens/EmailSignupPage.js"
import EmailVerfication from "../Screens/EmailVerification.js"
const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <Stack.Navigator initialRouteName="Connexion">
      <Stack.Screen name="StartPage" component={StartPage} options={{ headerShown: false }} />
      <Stack.Screen name="Connexion" component={Login} options={{ title: "Connexion" }} />
      <Stack.Screen name="Inscription" component={SignUp} options={{ title: "Créer un compte" }} />
      <Stack.Screen name="Vérification" component={verif} options={{ title: "Vérification" }} />
      <Stack.Screen name="Coordonnées" component={cord} options={{ title: "Informations personnelles" }} />
      <Stack.Screen name="Password" component={mdp} options={{ title: "Mot de passe" }} />
      <Stack.Screen name="Succès" component={succ} options={{ title: "Succès !" }} />
      <Stack.Screen name="Acceuil" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
      <Stack.Screen name="Guide" component={Guide} options={{ title: "Guide" }} />
      <Stack.Screen name="EmailSignup" component={EmailSignupPage} options={{ title: "Saisir votre E-mail" }} />
      <Stack.Screen name="EmailVerification" component={EmailVerfication} options={{ title: "Vérification E-mail" }} />
    </Stack.Navigator>
  );
}
