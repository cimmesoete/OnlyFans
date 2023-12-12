// ProfileScreen.js
// eliminate type errors

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Storage, Auth, DataStore } from 'aws-amplify';
import { UserData } from '../src/models';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';

const ProfileScreen = () => {
  const [avatar, setAvatar] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [bio, setBio] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get user ID after authentication
    Auth.currentAuthenticatedUser()
      .then(user => setUserId(user.attributes.sub))
      .catch(error => console.error('Error getting user ID:', error));
  }, []);
//  console.log('User:', user);
  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      if (type === 'avatar') {
        setAvatar(result.assets[0].uri);
      } else if (type === 'background') {
        setBackgroundImage(result.assets[0].uri);
      }
    }
  };

  const saveProfile = async () => {
    // Upload images to S3
    const avatarKey = `avatars/${userId}/${Date.now()}-avatar.jpg`;
    await Storage.put(avatarKey, avatar, { contentType: 'image/jpeg' });

    const backgroundImageKey = `backgrounds/${userId}/${Date.now()}-background.jpg`;
    await Storage.put(backgroundImageKey, backgroundImage, { contentType: 'image/jpeg' });

    // Update user profile in the DataStore
    try {
      await DataStore.save(
        UserData.copyOf(user => {
          user.id = userId;
          user.avatar = avatarKey;
          user.backgroundImage = backgroundImageKey;
          user.bio = bio;
        })
      );
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View>
      <Text>Profile Screen</Text>
      <Button title="Pick Avatar" onPress={() => pickImage('avatar')} />
      {avatar && <Image source={{ uri: avatar }} style={{ width: 100, height: 100 }} />}
      <Button title="Pick Background" onPress={() => pickImage('background')} />
      {backgroundImage && <Image source={{ uri: backgroundImage }} style={{ width: 200, height: 100 }} />}
      <TextInput
        placeholder="Enter Bio"
        value={bio}
        onChangeText={(text) => setBio(text)}
        multiline
        numberOfLines={4}
      />
      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
};

export default ProfileScreen;
