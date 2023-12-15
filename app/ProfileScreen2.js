// ProfileScreen.js
// eliminate type errors

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Storage, Auth, DataStore } from 'aws-amplify';
import { UserData } from '../src/models';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useRouter, Link } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../src/models';



const ProfileScreenUpdater = () => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUri, setAvatarUri] = useState();
  const [avatar, setAvatar] = useState();
  const [backgroundImage, setBackgroundImage] = useState();
  const [backgroundImageUri, setBackgroundImageUri] = useState();
  const [subscriptionPrice, setSubscriptionPrice] = useState();

  const [userId, setUserId] = useState('');

  const { user } = useAuthenticator();

  const router = useRouter();
 
  async function getUserProfile(userId){
    const userProfile = await DataStore.query(User, userId);
    setName(userProfile.name);
    setHandle(userProfile.handle);
    setBio(userProfile.bio);   
    setAvatar(userProfile.avatar); 
    setBackgroundImage(userProfile.backgroundImage);
    setSubscriptionPrice(userProfile.subscriptionPrice);
  
    return userProfile;
  };

  getUserProfile(user.attributes.sub);
//    const usersProfile = getUserProfile(user.attributes.sub);

  useEffect(() => {
    Storage.get(avatar).then(setAvatarUri);
    Storage.get(backgroundImage).then(setBackgroundImageUri);
  }, []);


//  console.log('function getUserProfile user profile name:', name);
//  console.log('function getUserProfile background image:', backgroundImageUri);
//  console.log('function getUserProfile user profile bio:', bio);


  // console.log('bio:', usersProfile);
  // console.log('user name:', user.attributes.name);
  /*
  useEffect(() => {
    // Get user ID after authentication
    Auth.currentAuthenticatedUser()
      .then(user => setUserId(user.attributes.sub))
      .catch(error => console.error('Error getting user ID:', error));
  }, []);
*/
  /*
  useEffect(() => {
    // Get user profile data from DataStore
    DataStore.query(UserData, userId)
      .then(user => {
        setAvatar(user.avatar);
        setBackgroundImage(user.backgroundImage);
        setBio(user.bio);
      })
      .catch(error => console.error('Error getting user profile:', error));
  }
  

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
*/

  return (
    <SafeAreaView style={{ margin: 10 }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
      >
        <Ionicons
          onPress={() => router.back()}
          name="arrow-back"
          size={28}
          color="black"
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontWeight: '500', fontSize: 20 }}>Profile</Text>
      </View>

      <View>
            <Text>Avatar</Text>
            {avatarUri && <Image src={avatarUri} style={styles.userImage} />}
          
      </View>
      <View>
            <Text>Background Image</Text>
            {backgroundImageUri && <Image src={backgroundImageUri} style={styles.backImage} />}
        
      </View>
    </SafeAreaView>
  );
};
export default ProfileScreenUpdater;

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: 'gray',
    padding: 10, 
    flexDirection: 'row',
    alignItems: 'flex-end',

    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
   // position: 'absolute',
   // top: 0,
   // bottom: 0,
   // left: 0,
   // right: 0,
   ...StyleSheet.absoluteFillObject,
  },
  userImage: {
    width: 200,
    height: 200,
//    borderRadius: 100,
    borderColor: 'white',
    borderWidth: 3,
    marginRight: 20,
  },
  backImage: {
    width: 200,
    height: 200,
    borderColor: 'white',
    borderWidth: 3,
    marginRight: 20,
  },
})



