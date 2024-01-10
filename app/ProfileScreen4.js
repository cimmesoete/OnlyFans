// ProfileScreen.js
// eliminate type errors

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Button, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Storage, Auth, DataStore } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useRouter, Link } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../src/models';

const ProfileScreenUpdater = () => {
    const [dummyState, setDummyState] = useState(0);
    const [thisUser, setUser] = useState(null);
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
    const [show, setShow] = useState(false);

/*
    useEffect(() => {
      DataStore.query(User, user.attributes.sub).then(setUser);
//      console.log("Fetched User: ", thisUser);
//      setName(thisUser?.name);
//      console.log("Fetched Name: ", name);
  }, []);
*/

    useEffect(() => {
      const fetchdUser = async () => {
        try {
          await DataStore.start();
          const tempUser = user.attributes.sub;
          const result = await DataStore.query(User, tempUser);

          setUser(result);
          const url = await Storage.get(result.avatar);
          setAvatarUri(url);
          const url2 = await Storage.get(result.coverImage);
          setBackgroundImageUri(url2);
          setUserId(result.id);
          setName(result.name);
          setHandle(result.handle);
          setBio(result.bio);
          setAvatar(result.avatar);
          setBackgroundImage(result.coverImage);
          setSubscriptionPrice(result.subscriptionPrice);
        } catch (error) {   
            console.log('Error fetching user:', error);
        }
      };
      fetchdUser();
    }, []);



// Upload image or video asset to the s3 storage container    
    async function uploadImage(selectedImage, avatarOrBackground) {
      try {
        let fileKey;
        const response = await fetch(selectedImage);
        const blob = await response.blob();
//        console.log('UserID:', userId);
        if (avatarOrBackground === 'avatar') {
            fileKey = `avatars/${userId}/${Crypto.randomUUID()}.png`;
        } else if (avatarOrBackground === 'background') {
            fileKey = `backgrounds/${userId}/${Crypto.randomUUID()}.png`;
        };
        await Storage.put(fileKey, blob);
//        console.log('Filekey:', fileKey);
        return fileKey;
      } catch (err) {
        console.log('Yup, Error uploading file:', err, "filekey:", fileKey);
      }
    } 

// Pick image and hold filename in variable    
  const pickImage = async (type) => {
    setShow(true);
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
    };
    setShow(false);
  };

  const onPost = async () => {
    setShow(true);
    let avatarKey = avatar, backgroundImageKey = backgroundImage;

    // if avatar has been changed, call uploadImage to store avatar, set avatarUri to avatarKey
      if (newAvatar) {
        avatarKey = await uploadImage(avatarUri, 'avatar');
      };   

      // if background image has been changed, call uploadImage to store
      if (newBackgroundImage) {
        backgroundImageKey = await uploadImage(backgroundImageUri, 'background');
      };

      // post entry to User table in database

    const original = await DataStore.query(User, user.attributes.sub);

    const updatedPost = await DataStore.save(
      User.copyOf(original, updated => { 
          updated.name = name,
          updated.handle = handle,
          updated.bio = bio,
          updated.subscriptionPrice = subscriptionPrice,
          updated.avatar = avatarKey,
          updated.coverImage = backgroundImageKey
      })
    );

    setUserId('');
    setName('');
    setHandle('');
    setBio('');   
//    setAvatar(''); 
//    setBackgroundImage('');
    setSubscriptionPrice();
    setNewBackgroundImage(false);
    setNewAvatar(false);
    <Text style={{ fontWeight: '500', marginHorizontal: 10 }}> Profile Updated </Text>;
    setDummyState(Date.now());
    const url = await Storage.get(avatarKey);
    setAvatarUri(url);
    const url2 = await Storage.get(backgroundImageKey);
    setBackgroundImageUri(url2);
    setShow(false);
  };

  if (!thisUser) {
    return <Text>Loading...</Text>;
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
                <View style={[styles.buttonContainer, { borderWidth: 1, borderColor: "#000000", borderRadius: 10 }]}>
                  <View style={[styles.button, { borderWidth: 3, borderColor: "#ffd33d", borderRadius: 8 }]}>
                    <Button style={styles.button} title="Change Avatar" onPress={() => pickImage('avatar')} />
                  </View>
                </View>
            </View>
            <View>
                <Text>Background Image</Text>

                <View style={styles.container}>
                    {backgroundImageUri && <Image src={backgroundImageUri} style={styles.backImage} />}
                </View>
                <View style={[styles.buttonContainer, { borderWidth: 1, borderColor: "#000000", borderRadius: 10 }]}>
                  <View style={[styles.button, { borderWidth: 3, borderColor: "#ffd33d", borderRadius: 8 }]}>
                    <Button  title="Change Background Image" onPress={() => pickImage('background')} />
                  </View>
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
                value={String(subscriptionPrice)}
                onChangeText={textValue => setSubscriptionPrice(Number(textValue))}
                keyboardType='numeric'
            />
            <View style={[styles.buttonContainer, { borderWidth: 1, borderColor: "#000000", borderRadius: 10 }]}>
              <View style={[styles.button, { borderWidth: 3, borderColor: "#ffd33d", borderRadius: 8 }]}>
                <ActivityIndicator animating={show} />
                <Button style={styles.button} title="Update" onPress={onPost} />
              </View>
            </View>
        </SafeAreaView>
    </ScrollView>
  );
};

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
  buttonContainer: {
    width: 300,
    height: 60,
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'black',
    width: '102%',
    height: '110%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontSize: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 8,
  },
});

export default ProfileScreenUpdater;


