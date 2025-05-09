import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Création de la racine de l'application à partir du dossier `app`
export default function App() {
  const context = require.context('./app'); // Charge automatiquement tout le contenu de `app`.
  return <ExpoRoot context={context} />;
}

// Enregistrement du composant racine pour Expo
registerRootComponent(App);
