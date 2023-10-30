import React from 'react';
import { View, Text } from 'react-native';
import Video from 'react-native-video';
import { Storage } from 'aws-amplify';

const VideoDisplay = (videoUrlAddressPass) => {
  // Replace 'your-video-key' with the actual key of the video in your S3 bucket
  const videoKey = 'treadmill.mp4';

  const videoURL = async () => {
    try {
      const url = await Storage.get(videoKey);
      console.log(url);
      return url;
    } catch (error) {
      console.error('Error fetching video:', error);
      return null;
    }
  };

  return (
    <View>
      <Text>Video Player</Text>
      <Video
        source={{ uri: "treadmill.mp4" }}
        style={{ width: 300, height: 200 }}
      />
    </View>
  );
};

export default VideoDisplay;
