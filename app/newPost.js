import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Button,
    Image,
    ScrollView,
    ActivityIndicator,
  } from 'react-native';
  import { useState } from 'react';
  import { Feather, Ionicons } from '@expo/vector-icons';
  import * as ImagePicker from 'expo-image-picker';
  import { Video, ResizeMode } from 'expo-av';
  import { useRouter } from 'expo-router';
  import { DataStore, Storage } from 'aws-amplify';
  import { Post } from '../src/models';
  import { useAuthenticator } from '@aws-amplify/ui-react-native';
  import * as React from 'react';
  import * as Crypto from 'expo-crypto';
  
  const imageStr="image";
  const videoStr="video";
  
  const NewPost = () => {
    const [text, setText] = useState('');
    const [selectedImage, setImage] = useState('');
    const [typeOfImage, setImageType] = useState('');
    const [show, setShow] = useState(false);
    const videoMovie = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const { user } = useAuthenticator();
  
    const router = useRouter();
  
    const onPost = async () => {
      // console.warn('Post: ', text);
      setShow(true);
      const imageKey = await uploadImage();

      // post entry to POST table in database
      await DataStore.save(
        new Post({ text, likes: 0, userID: user.attributes.sub, image: imageKey, imageType: typeOfImage })
      );
  
      setText('');
      setImage('');
      setImageType('');
      <Text style={{ fontWeight: '500', marginHorizontal: 10 }}> New post added </Text>;
      setShow(false);
    };

// Upload image or video asset to the s3 storage container    
    async function uploadImage() {
      try {
        let fileKey;
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        if (typeOfImage==imageStr) {
          fileKey = `${Crypto.randomUUID()}.png`;
        } else if (typeOfImage==videoStr) {
          fileKey = `${Crypto.randomUUID()}.mp4`;
        };
        await Storage.put(fileKey, blob,);
        return fileKey;
      } catch (err) {
        console.log('Yup, Error uploading file:', err, "filekey:", fileKey);
      }
    }
  
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setImageType(imageStr);
      }
    };

    const pickVideo = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setImageType(videoStr);

      }
    };
  
    return (
      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps="handled">
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
            <Text style={{ fontWeight: '500', fontSize: 20 }}>New post</Text>
          </View>
    
          <TextInput
            placeholder="Compose new post..."
            value={text}
            onChangeText={setText}
            // multiline
            numberOfLines={3}
          />
    
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15, justifyContent: 'space-evenly' }}>
            <Feather onPress={pickImage} name="image" size={24} color="gray" />
            <Feather onPress={pickVideo} name="video" size={24} color="gray" />
          </View>
    
          {selectedImage && <Image src={selectedImage} style={{ width: '100%', aspectRatio: 1 }} />}
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 0 }}>
            {(typeOfImage == videoStr) && selectedImage && ( 
              <Video        
                ref={videoMovie}
                style={styles.video}
                source={{uri: selectedImage}}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)} /> 
            )}
          </View>

          <View style={[styles.buttonContainer, { borderWidth: 1, borderColor: "#000000", borderRadius: 10 }]}>
            <View style={[styles.button, { borderWidth: 3, borderColor: "#ffd33d", borderRadius: 8 }]}>
              <ActivityIndicator animating={show} />
              <Button title="Post" onPress={onPost} />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    buttonContainer: {
      width: 300,
      height: 60,
      marginHorizontal: 35,
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
    video: {
      //  flex: 1,
      //  alignSelf: 'stretch',
      position: 'relative',
      alignItems: 'center',
        width: '100%',
        height: 350,
    },
  });

  export default NewPost;