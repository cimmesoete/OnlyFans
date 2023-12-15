import { StyleSheet, View, Text, Image } from "react-native";
import { Stack } from 'expo-router';
import { API, Amplify, DataStore, Hub } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import { Authenticator } from '@aws-amplify/ui-react-native';
import { useEffect } from 'react';
// import { User } from '../src/models';

// setup global providers, configure Amplify, wrap root layout

Amplify.configure(awsconfig);

const CreateUserMutation = `
mutation createUser($input: CreateUserInput!, {onError: (err) => {
  setError(err);}) {
  createUser(input: $input) {
    id
    name
    handle
    bio
    subscriptionPrice
  }
}`;

function LogoTitle() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 50 }}>
      <Image
        style={{ width: 65, height: 45, marginRight: 8, borderColor: 'white', borderWidth: 1 }}
        source={require('../assets/data/CabanaClub2.png')}
      />
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Cabana Club</Text>
    </View>
  );
};

export default function RootLayout() {
  <View>
    <Text style={{ fontSize: 40 }}>Bring your favorite creators home</Text>
  </View>

  useEffect(() => {
    const removeListener = Hub.listen('auth', async (data) => {
      <View>
        <Text style={{ fontSize: 40 }}>Bring your favorite creators home2</Text>
      </View>
      if (data.payload.event == 'signIn') {
        const userInfo = data.payload.data.attributes;
        <View>
          <Text style={{ fontSize: 40 }}>Bring your favorite creators home3</Text>
        </View>;
        

        // DataStore.save(new User({ id: userInfo.sub, name: userInfo.name }));

        // save user to database
        const newUser = {
          id: userInfo.sub,
          name: userInfo.name,
          handle: userInfo.nickname,
          subscriptionPrice: 0,
        };

        await API.graphql({
          query: CreateUserMutation,
          variables: { input: newUser },
        });
        
        <View>
          <Text style={{ fontSize: 40 }}>Bring your favorite creators home3</Text>
        </View>
      }
    });

    return () => {
      // cleanup function, prevent memory leaks
      removeListener();
    };
  }, []);

  return (
    <Authenticator.Provider>
      <Authenticator>
        <Stack screenOptions={{ 
          // headerShown: false 
          // title: 'Cabana',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // headerRight: 'Cabana Club',
          headerTitle: props => <LogoTitle {...props} />
        }} />
      </Authenticator>
    </Authenticator.Provider>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 75,
  },
}); 