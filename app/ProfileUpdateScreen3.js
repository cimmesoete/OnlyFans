import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import { DataStore, Storage } from 'aws-amplify';
import * as ImagePicker from 'expo-image-picker';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { User } from '../src/models';
import { useRouter } from 'expo-router';

const ProfileUpdateScreen = () => {
  const { user } = useAuthenticator();
//    const [user, setUser] = useState(route.params.user);
   const [profile, setProfile] = useState(user);
  const [avatarUri, setAvatarUri] = useState(user.avatar);
//  const [coverImageUri, setCoverImageUri] = useState('');
  const router = useRouter();

//  console.log("who am I? ", user.name);

  useEffect(() => {
    // Load existing avatar and coverImage images
    if (user.avatar) {
      loadAndDisplayImage(user.avatar, setAvatarUri);
    }

/*    if (user.coverImage) {
      loadAndDisplayImage(user.coverImage, setCoverImageUri);
    } */
  }, [user]);

  const loadAndDisplayImage = async (key, setter) => {
    try {
      const url = await Storage.get(key);
      setter(url);
      console.log("image url: ", url);
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const pickImage = async (setter) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setter(result.uri);
    }
  };

  const updateProfile = async () => {
    try {
      // Update user fields
//      const updatedUser = { ...user, avatar: '', /* coverImage: '', */ bio: '', };
      await DataStore.save(profile);

      // Upload new images to S3
      if (avatarUri) {
        const avatarKey = `avatars/${user.id}-${Date.now()}`;
        await Storage.put(avatarKey, avatarUri, { contentType: 'image/jpeg' });
        updatedUser.avatar = avatarKey;
      }

/*      if (coverImageUri) {
        const coverImageKey = `covers/${user.id}-${Date.now()}`;
        await Storage.put(coverImageKey, coverImageUri, { contentType: 'image/jpeg' });
        updatedUser.coverImage = coverImageKey;
      } 
      */

      // Update user with image references
      await DataStore.save(User.copyOf(updatedUser));

      // Navigate back or perform other actions
    //  navigation.goBack();
        router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View>
      <Text>Name: </Text>
      <TextInput
        value={user.name}
        onChangeText={(value) => setUser({ ...user, name: value })}
      />
//      {/* Add other fields here */}

      <Button title="Pick Avatar" onPress={() => pickImage(setAvatarUri)} />
      {avatarUri ? <Image source={{ uri: avatarUri }} style={{ width: 100, height: 100 }} /> : null}

      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
};

export default ProfileUpdateScreen;
