// ProfileScreen.js
// eliminate type errors

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Button, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Storage, Auth, DataStore } from 'aws-amplify';
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
    const [avatar, setAvatar] = useState('');
    const [avatarUri, setAvatarUri] = useState();
    const [newAvatar, setNewAvatar] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState('');
    const [backgroundImageUri, setBackgroundImageUri] = useState();
    const [newBackgroundImage, setNewBackgroundImage] = useState(false);
    const [subscriptionPrice, setSubscriptionPrice] = useState();
    const [userId, setUserId] = useState('');
    const { user } = useAuthenticator();
    const router = useRouter();


    useEffect(() => {
      DataStore.query(User, user.attributes.sub).then(setUser);
//      console.log("Fetched User: ", thisUser);
//      setName(thisUser?.name);
//      console.log("Fetched Name: ", name);
  }, []);



/*
    useEffect(() => {
        const fetchdUser = async () => {
            try {
                const selectedUser = await DataStore.query(User, user.attributes.sub);
                setUser(selectedUser);
                setName(thisUser?.name);
                console.log("Fetched User: ", thisUser);
                console.log("Fetched Name: ", name);
            } catch (error) {   
                console.log('Error fetching user:', error);
            }
        }
        fetchdUser();
        console.log("Fetched User Name: ", thisUser?.name);

    }, []);
*/


    useEffect(() => {
        setUserId(user.attributes.sub);

        setName(thisUser?.name);
        setHandle(thisUser?.handle);
        setBio(thisUser?.bio);   
        setAvatar(thisUser?.avatar); 
        setBackgroundImage(thisUser?.coverImage);
        setSubscriptionPrice(thisUser?.subscriptionPrice);
        console.log("Set Name: ", name);
        console.log("Set HANDLE: ", handle);
        console.log("Set Bio:", bio);
        console.log("Set Avatar: ", avatar);
        console.log("Set Background: ", backgroundImage);
        console.log("Set Price: ", subscriptionPrice);
        console.log("UID: ", userId);
        console.log("thisuser: ", thisUser);
    }, []);

/*
  console.log("This User Name: ", thisUser?.name);
  console.log("This User HANDLE: ", thisUser?.handle);
  console.log("This User Bio:", thisUser?.bio);
  console.log("This User Avatar: ", thisUser?.avatar);
  console.log("This User Background: ", thisUser?.coverImage);
  console.log("This User Price: ", thisUser?.subscriptionPrice);
  console.log("This User UID: ", userId);
  console.log("This User thisuser: ", thisUser);
*/


  useEffect(() => {
    Storage.get(thisUser?.avatar).then(setAvatarUri);
    Storage.get(thisUser?.coverImage).then(setBackgroundImageUri);
  }, []);

//  console.log('function getUserProfile user profile name:', thisUser?.name);

// Upload image or video asset to the s3 storage container    
    async function uploadImage(selectedImage, avatarOrBackground) {
      try {
        let fileKey;
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        if (avatarOrBackground === 'avatar') {
            fileKey = `avatars/${userId}/${Crypto.randomUUID()}.png`;
        } else if (avatarOrBackground === 'background') {
            fileKey = `backgrounds/${userId}/${Crypto.randomUUID()}.png`;
        };
        await Storage.put(fileKey, blob,);
        return fileKey;
      } catch (err) {
        console.log('Yup, Error uploading file:', err, "filekey:", fileKey);
      }
    } 

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      if (type === 'avatar') {
        setAvatarUri(result.assets[0].uri);
        setNewAvatar(true);
      } else if (type === 'background') {
        setBackgroundImageUri(result.assets[0].uri);
        setNewBackgroundImage(true);
      }
    }
  };


  const onPost = async () => {
      // if avatar has been changed, call uploadImage to store avatar, set avatarUri to avatarKey
      if (newAvatar) {
        const avatarKey = uploadImage(avatarUri, 'avatar');
        setAvatar(avatarKey);
      };   

      // if background image has been changed, call uploadImage to store
      if (newBackgroundImage) {
        const backgroundImageKey = uploadImage(backgroundImageUri, 'background');
        setBackgroundImage(backgroundImageKey);
      };

    // post entry to User table in database
    console.log("Update Name: ", name);
    console.log("Update HANDLE: ", handle);
    console.log("Update Bio:", bio);
    console.log("Update Avatar: ", avatar);
    console.log("Update Background: ", backgroundImage);
    console.log("Update Price: ", subscriptionPrice);
    console.log("UID: ", userId);
    console.log("thisuser: ", thisUser);
    await DataStore.save(
      User.copyOf(thisUser, updated => { 
          updated.name = name,
          updated.handle = handle,
          updated.bio = bio,
          updated.subscriptionPrice = subscriptionPrice,
          updated.avatar = avatar,
          updated.coverImage = backgroundImage
      })
    );
//      setText('');
//      setImage('');
//      setImageType('');
    setName('');
    setHandle('');
    setBio('');   
    setAvatar(''); 
    setBackgroundImage('');
    setSubscriptionPrice();
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
                <Button title="Change Avatar" onPress={() => pickImage('avatar')} />
                <View style={styles.container}>
                    {avatarUri && <Image src={avatarUri} style={styles.userImage} />}
                </View>
            </View>
            <View>
                <Text>Background Image</Text>
                <Button title="Change Background Image" onPress={() => pickImage('background')} />
                <View style={styles.container}>
                    {backgroundImageUri && <Image src={backgroundImageUri} style={styles.backImage} />}
                </View>

            </View>
            <Text style={styles.titleText}>  Name</Text>
            <TextInput
                placeholder={name}
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



