import { View, Text, Image, Pressable, StyleSheet, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
// import { StatusBar } from 'expo-status-bar';
import { Entypo, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { DataStore, Storage } from 'aws-amplify';
import { User,Post as PostTable } from '../models';
import * as React from 'react';
import VolCapture from "./VolCapClick";
// import ImageWithVideo from './VideoDisplay2';
// import LikeButton from "./IncrementLikes";

const Post = ({ post }) => {
  const [user, setUser] = useState();
  const [imageUri, setImageUri] = useState();
  const [avatarUri, setAvatarUri] = useState();
  const srtImage = "image";
  const srtVolCap = "VolCap";
  const srtVideo = "video";
  const imageType = post.imageType;
  const [likes, setLikes] = useState(post.likes || 0);
  const videoMovie = React.useRef(null);
  const [status, setStatus] = React.useState({});
  // const imageAddress = post.imageAddress;

  useEffect(() => {
    DataStore.query(User, post.userID, 
    //  { sort: (s) => s.updatedAt(SortDirection.DESCENDING) }   NEED TO ADDRESS THIS
    ).then(setUser);
  }, []);

  useEffect(() => {
    if (post.image) {
      Storage.get(post.image).then(setImageUri);
    }
  }, [post.image]);

  useEffect(() => {
    Storage.get(user?.avatar).then(setAvatarUri);
  });


                                        // Increment likes
  const handleLike = async () => {
    const updatedLikes = likes + 1;
    try {
      await DataStore.save(
        PostTable.copyOf(post, (updated) => {
          updated.likes = updatedLikes
        })
      );

      setLikes(updatedLikes);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
                                        // End increment likes

  return (
    <View style={{ marginVertical: 15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
        <Image
          src={avatarUri}
          style={{
            width: 50,
            aspectRatio: 1,
            borderRadius: 50,
            marginRight: 10,
          }}
        />
        <View>
          <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 3 }}>
            {user?.name}
          </Text>
          <Text style={{ color: 'gray' }}>@{user?.handle}</Text>
        </View>

        <View
          style={{
            marginLeft: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ marginRight: 5, color: 'gray' }}>3 hours ago</Text>
          <Entypo name="dots-three-horizontal" size={18} color="gray" />
        </View>
      </View>

      <Text style={{ margin: 10, lineHeight: 18 }}>{post.text}</Text>


      {(imageType == srtImage) && (
         <Image src={imageUri} style={{ width: '100%', aspectRatio: 1 }} />
      )}

      {(imageType == srtVideo) && ( 
        <Video        
          ref={videoMovie}
          style={styles.video}
          source={{uri: imageUri}}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      //  console.log(imageType)
      )}

      {(imageType == srtVolCap) && ( <Pressable onPress={() => VolCapture(post.imageAddress)}>
          <View style={{ alignItems: 'center', }}>
            <Image src={imageUri} style={styles.circle}/>
            <Text style={styles.textContainer}>Bring them home</Text>
          </View>
        </Pressable>
      )}


      <View style={{ margin: 10, flexDirection: 'row' }}>
        <Pressable onPress={handleLike}>
          <AntDesign
            name="hearto"
            size={22}
            color="gray"
            style={{ marginRight: 15 }}
          />
        </Pressable>

        <FontAwesome5
          name="dollar-sign"
          size={20}
          color="gray"
          style={{ marginRight: 15 }}
        />
      </View>
      
      <Text style={{ fontWeight: '500', marginHorizontal: 10 }}>
        {post.likes} Likes
      </Text>
      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 350, // Adjust the dimensions as needed to make the circle
    height: 350,
    borderRadius: 175, // Half of the width/height to make it a circle
    borderWidth: 3, // Border width for the white border
    borderColor: 'blue', // White color for the border
    overflow: 'hidden', // Hide any image content that exceeds the circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // alignItemsVertical: '175',
    top: 150, // Adjust the top and left positions to place the text where you want
    // left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background
    padding: 10,
    // borderRadius: 5,
    color: 'white',
    fontSize: 18,
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
  },
  video: {
  //  flex: 1,
  //  alignSelf: 'stretch',
    width: '100%',
    height: 350,
  },
});


export default Post;