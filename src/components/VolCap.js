import React from 'react';
import { View, TouchableOpacity, Text, Linking } from 'react-native';

const appUrlHeader = 'https://dne.app.link/';
const appUrlAddress = 'Victor_Ortiz_Freestyling_384f_share';

const VolCapture = () => {
  const openExternalApp = async () => {
    const appUrl = appUrlHeader + appUrlAddress; // Replace with the URL scheme of the external app

    try {
      const supported = await Linking.canOpenURL(appUrl);

      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        console.error('The app is not installed or supported.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={openExternalApp} style={{ padding: 16, backgroundColor: 'blue' }}>
        <Text style={{ color: 'white' }}>Open Volumetric App</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VolCapture;
