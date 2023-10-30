import React from 'react';
import { View, TouchableOpacity, Text, Linking } from 'react-native';

const appUrlHeader = 'https://dne.app.link/';
// const appUrlAddress = 'Victor_Ortiz_Freestyling_384f_share';

const VolCapture = (appUrlAddressPass) => {
    const appUrl = appUrlHeader + appUrlAddressPass; // Replace with the URL scheme of the external app

    try {
      const supported = Linking.canOpenURL(appUrl);

      if (supported) {
            Linking.openURL(appUrl);
      } else {
        console.error('The app is not installed or supported.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
};

export default VolCapture;
