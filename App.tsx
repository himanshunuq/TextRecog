import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import MlkitOcr from 'react-native-mlkit-ocr';

const App = () => {
  const device = useCameraDevice('back');
  const hasPermission = useCameraPermission();
  const [photoStatus, setPhotoStatus] = useState<boolean>(true);
  const [photoPath, setPhotoPath] = useState<string>();
  const cameraRef = useRef<Camera>(null);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    if (newCameraPermission == null) {
      ToastAndroid.show('Camera is not ready', ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  if (device == null) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  // const takePhoto = async () => {
  //   try {
  //     const photo = await cameraRef.current?.takePhoto();
  //     if (photo?.path) {
  //       setPhotoPath(photo.path);
  //       setPhotoStatus(true);

  //       // Process text recognition
  //       const recognizedText = await MlkitOcr.detectFromFile(photo.path);
  //       console.log('Recognized Text:', recognizedText);

  //       // Extract text from blocks
  //       const extractedText = recognizedText
  //         .map(block => block.text)
  //         .join('\n');
  //       console.log('Extracted Text:', extractedText);
  //     }
  //   } catch (error) {
  //     console.error('Error taking photo or recognizing text:', error);
  //   }
  // };

  const takePhoto = async () => {
    try {
      const photo = await cameraRef.current?.takePhoto();
      if (photo?.path) {
        const photoPath = 'file://' + photo.path; // Ensure proper URI format
        setPhotoPath(photoPath);
        setPhotoStatus(true);
  
        // Check if file exists
        // const fileExists = await REFS.exists(photoPath);
        // if (!fileExists) {
        //   throw new Error('File does not exist at path: ' + photoPath);
        // }
  
        // Process text recognition
        const recognizedText = await MlkitOcr.detectFromFile(photoPath);
        console.log('Recognized Text:', recognizedText);
  
        const extractedText = recognizedText.map(block => block.text).join('\n');
        console.log('Extracted Text:', extractedText);
      }
    } catch (error)
     {
      console.error('Error taking photo or recognizing text:', error);
    }
  };

  const openPhoto = () => {
    setPhotoStatus(false);
  };

  return (
    <View style={styles.container}>
      {photoStatus ? (
        <View style={styles.container}>
          {photoPath && (
            <Image style={styles.image} source={{uri: 'file://' + photoPath}} />
          )}
          <TouchableOpacity style={styles.openButton} onPress={openPhoto}>
            <Text style={styles.btnText}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity style={styles.button} onPress={takePhoto} />
        </View>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 30,
    borderRadius: 30,
    alignSelf: 'center',
  },
  image: {
    width: '90%',
    height: '80%',
    alignSelf: 'center',
  },
  openButton: {
    width: 100,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});






