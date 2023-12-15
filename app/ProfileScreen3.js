// ProfileScreen.js
// eliminate type errors

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Button, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Storage, Auth, DataStore } from 'aws-amplify';
// import { UserData } from '../src/models';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useRouter, Link } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../src/models';


const ProfileScreenUpdater = () => {
  const [dummyState, setDummyState] = useState(0);
  const [thisUser, setUser] = useState();
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


  useEffect(() => {
    DataStore.query(User, user.attributes.sub, ).then(setUser);
    setName(thisUser?.name);
    setHandle(thisUser?.handle);
    setBio(thisUser?.bio);   
    setAvatar(thisUser?.avatar); 
    setBackgroundImage(thisUser?.coverImage);
    setSubscriptionPrice(thisUser?.subscriptionPrice);
  }, []);

/*  async function getUserProfile(userId){
    const userProfile = await DataStore.query(User, userId);
    return userProfile;
  };
*/

//  getUserProfile(user.attributes.sub);
//    const usersProfile = getUserProfile(user.attributes.sub);

  useEffect(() => {
    Storage.get(thisUser?.avatar).then(setAvatarUri);
    Storage.get(thisUser?.coverImage).then(setBackgroundImageUri);
  }, []);


//  console.log('function getUserProfile user profile name:', thisUser?.name);
//  console.log('function getUserProfile background image:', backgroundImageUri);
//  console.log('function getUserProfile user profile bio:', bio);


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
    const onPost = async () => {
      // console.warn('Post: ', text);
    //  const imageKey = await uploadImage();
    //    const subPrice = Number(subscriptionPrice);

      // post entry to POST table in database
      await DataStore.save(
        User.copyOf(thisUser, updated => { 
            updated.name = name,
            updated.handle = handle,
            updated.bio = bio,
            updated.subscriptionPrice = subscriptionPrice
            //
            //
            //

        })
      );
  
//      setText('');
//      setImage('');
//      setImageType('');
      <Text style={{ fontWeight: '500', marginHorizontal: 10 }}> Profile Updated </Text>;
      setDummyState(Date.now());
    };


  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps="handled">
        <SafeAreaView style={{ margin: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
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
                <View style={styles.container}>
                    {avatarUri && <Image src={avatarUri} style={styles.userImage} />}
                </View>
            </View>
            <View>
                <Text>Background Image</Text>
                <View style={styles.container}>
                    {backgroundImageUri && <Image src={backgroundImageUri} style={styles.backImage} />}
                </View>

            </View>
            <Text style={styles.titleText}>  Name</Text>
            <TextInput
                placeholder={thisUser?.name}
                placeholderTextColor={'blue'}
                value={name}
                onChangeText={setName}
                numberOfLines={1}
            />
            <Text style={styles.titleText}>  Handle</Text>
            <TextInput
                placeholder={thisUser?.handle}
                placeholderTextColor={'blue'}
                value={handle}
                onChangeText={setHandle}
                numberOfLines={1}
            />
            <Text style={styles.titleText}>  Biography</Text>
            <TextInput
                placeholder={thisUser?.bio}
                placeholderTextColor={'blue'}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
            />
            <Text style={styles.titleText}>  Subscription Rate</Text>
            <TextInput
                placeholder={"$"+String(thisUser?.subscriptionPrice)}
                placeholderTextColor={'blue'}
                value={subscriptionPrice}
                onChangeText={textValue => setSubscriptionPrice(Number(textValue))}
                keyboardType='numeric'
                // textAlign='right'
            />
            <Button title="Update" onPress={onPost} />
        </SafeAreaView>
    </ScrollView>
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
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 250,
    height: 250,
    borderRadius: 125,
   //  alignItems: 'center',
    borderColor: 'white',
    borderWidth: 3,
    marginRight: 20,
  },
  backImage: {
    width: 350,
    height: 200,
    // alignItems: 'center',
    borderColor: 'white',
    borderWidth: 3,
    marginRight: 20,
  },
  titleText:{
    textDecorationLine: 'underline',
  },
})



