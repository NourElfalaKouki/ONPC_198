import { useState } from 'react';
import { Image, TouchableOpacity, Modal, View } from 'react-native';

const ImageMessageViewer = ({ uri }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setIsFullscreen(true)}>
        <Image source={{ uri }} style={{ width: 200, height: 200 }} />
      </TouchableOpacity>

      <Modal visible={isFullscreen} transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            onPress={() => setIsFullscreen(false)}
          >
            <Image 
              source={{ uri }} 
              style={{ flex: 1 }} 
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};
export default ImageMessageViewer;
