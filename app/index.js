import { StyleSheet, View, FlatList, Text } from "react-native";
// import users from "../assets/data/users";
import UserCard from "../src/components/UserCard";
import { Link } from "expo-router";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify/lib-esm";
import { User } from "../src/models";
import { Ionicons } from '@expo/vector-icons';

export default function Page() {
  const [users, setUsers] = useState([]);

  const {signOut} = useAuthenticator();

  useEffect(() => {
    // fetch users
    DataStore.query(User).then(setUsers);
  }, []);

  return (
    <View style={styles.container}>
      <Link style={{ fontWeight: '500', fontSize: 20 }} href={'/newPost'}>
        New post
        <Ionicons
          name="arrow-forward"
          size={20}
          color="black"
          style={{ marginRight: 10 }}
        />
      </Link>
      <Link style={{ fontWeight: '500', fontSize: 20 }} href={'/ProfileUpdateScreen2'}>
        My Bio
        <Ionicons
          name="arrow-forward"
          size={20}
          color="black"
          style={{ marginRight: 10 }}
        />
      </Link>
      <Text style={{ fontWeight: '500', fontSize: 20 }} onPress={() => signOut()}>
        Sign out
        <Ionicons
          name="arrow-forward"
          size={20}
          color="black"
          style={{ marginRight: 10 }}
        />
      </Text>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserCard user={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 15,
  }, 
});
