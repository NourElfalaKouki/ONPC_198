import React from 'react';
import { View, Text } from 'react-native';

const TestScreen = ({ route }) => {
  // Assurez-vous que route.params est défini avant d'accéder à userId
  if (!route.params || !route.params.userId) {
    return (
      <View>
        <Text>UserId n'est pas disponible</Text>
      </View>
    );
  }

  // Récupérez userId
  const { userId } = route.params;

  return (
    <View>
      <Text>UserId reçu: {userId}</Text>
    </View>
  );
};

export default TestScreen;
