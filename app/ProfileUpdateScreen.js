import { useState, useEffect } from 'react';
import { View, TextInput, SafeAreaView, Button, Image } from 'react-native';
import { DataStore, Storage } from 'aws-amplify';
import { ImagePicker } from 'expo-image-picker';
import { useAuthenticator } from '@aws-amplify/ui-react-native';


function ProfileUpdateScreen({route}) {

 //   const user = route;
 const { user } = useAuthenticator();
 console.log('User1:', user);
 console.log('UserMe1Name:', user.name);
 //   const [user, setUser] = useState(user);
    
  const [name, setName] = useState('');
//  const [bio, setBio] = useState(user.bio); 
//  const [avatar, setAvatar] = useState(user.avatar);

  useEffect(() => {
    console.log('UserMe1:', user);


    if(user) {
      setName(user.name);

      console.log("NameMe1: ", name);  
    }
  }, [user]);


 console.log("Name2: ", name);
// console.log("User Bio: ", bio);

/*  useEffect(() => {
    loadAvatar();
  }, []);

  const loadAvatar = async () => {
    if(avatar) {
      const image = await Storage.get(avatar);
      setAvatar(image);
    }
  } */
/*
  const updateProfile = async () => {
    await DataStore.save(
      DataStore.query(User, user.id), 
      {name, bio, avatar}
    );
  }
*/
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      let image = await Storage.put(result.assets[0].uri);
      setAvatar(image.key);
    }
  }

  return (
    <SafeAreaView style={{ margin: 10 }}>
      <View>
        <TextInput
          placeholder={user.name}
          value={name}
          onChangeText={text => setName(text)} 
        />
      </View>
    </SafeAreaView>
  );
}

export default ProfileUpdateScreen;
