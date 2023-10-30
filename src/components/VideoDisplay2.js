import React, { useState } from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import Video from 'react-native-video';
import videoClip from './treadmill.mp4';

const ImageWithVideo = () => {
  const [isVideoVisible, setVideoVisible] = useState(false);

  const toggleVideo = () => {
    setVideoVisible(!isVideoVisible);
  };

  return (
    <View>
      {isVideoVisible ? (
        <Video
          source={videoClip}
          style={{ width: 300, height: 200 }}
          controls={true}
          paused={false}
          repeat={true}
        />
//          <Image
//            source={require('./brands.jpg')}
//            style={{ width: 300, height: 200 }}
//          />
) : (
        <Pressable onPress={toggleVideo}>
          <Image
            source={require('./treatmill_pic.jpg')}
            style={{ width: 300, height: 200 }}
          />
        </Pressable>
      )}
    </View>
  );
};

export default ImageWithVideo;
