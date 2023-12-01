// ProfileUpdateScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Storage, Auth, DataStore } from 'aws-amplify';
import { User } from '../src/models';
import { useRouter } from 'expo-router';
import { useAuthenticator } from '@aws-amplify/ui-react-native';

const ProfileUpdateScreen = () => {
// const ProfileUpdateScreen = ({ route, navigation }) => {
    //  const { userId } = route.params; cki: maybe use useAuthenticator() instead?

  const { userId } = useAuthenticator();
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [subscriptionPrice, setSubscriptionPrice] = useState('');
  const router = useRouter();

//  console.log(userId);

  useEffect(() => {
    // Fetch existing user data from DataStore
    const fetchUserData = async () => {
      try {
        const userData = await DataStore.query(User, userId);
        setName(userData.name);
//        console.log(userData.name);
        setHandle(userData.handle);
        setBio(userData.bio || '');
        setAvatar(userData.avatar || null);
        setCoverImage(userData.coverImage || null);
    //    setSubscriptionPrice(userData.subscriptionPrice.toString()); i don't know if the toString conversion is necessary here
        setSubscriptionPrice(userData.subscriptionPrice);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      if (type === 'avatar') {
        setAvatar(result.uri);
      } else if (type === 'coverImage') {
        setCoverImage(result.uri);
      }
    }
  };

  const saveProfile = async () => {
    // Upload images to S3
    const avatarKey = avatar ? `avatars/${userId}/${Date.now()}-avatar.jpg` : null;
    const coverImageKey = coverImage ? `covers/${userId}/${Date.now()}-cover.jpg` : null;

    if (avatar) {
      await Storage.put(avatarKey, avatar, { contentType: 'image/jpeg' });
    }

    if (coverImage) {
      await Storage.put(coverImageKey, coverImage, { contentType: 'image/jpeg' });
    }

    // Update user profile in the DataStore
    try {
      await DataStore.save(
        User.copyOf(existingUser => {
          existingUser.id = userId;
          existingUser.name = name;
          existingUser.handle = handle;
          existingUser.bio = bio;
          existingUser.avatar = avatarKey;
          existingUser.coverImage = coverImageKey;
          existingUser.subscriptionPrice = parseFloat(subscriptionPrice);
        })
      );
      console.log('Profile updated successfully!');
      // navigation.goBack();
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
  //  fetchUserData(),
    <View>
      <Text>Name: {name}</Text>
      <TextInput value={name} onChangeText={setName} />

      <Text>Handle: {handle}</Text>
      <TextInput value={handle} onChangeText={setHandle} />

      <Text>Bio: {bio}</Text>
      <TextInput value={bio} onChangeText={setBio} />

      <Text>Avatar</Text>
      <Button title="Pick Avatar" onPress={() => pickImage('avatar')} />
      {avatar && <Image source={{ avatar }} style={{ width: 100, height: 100 }} />}

      <Text>Cover Image</Text>
      <Button title="Pick Cover Image" onPress={() => pickImage('coverImage')} />
      {coverImage && <Image source={{ coverImage }} style={{ width: 200, height: 100 }} />}

      <Text>Subscription Price</Text>
      <TextInput value={subscriptionPrice} onChangeText={setSubscriptionPrice} keyboardType="numeric" />

      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
};

export default ProfileUpdateScreen;
