import { StyleSheet, View, FlatList, Text } from "react-native";
// import users from "../assets/data/users";
import UserCard from "../src/components/UserCard";
import { Link } from "expo-router";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify/lib-esm";
import { User } from "../src/models";
import { Ionicons } from '@expo/vector-icons';
// import { ProfileScreenUpdater } from "./ProfileScreen2";
import { useNavigation } from "@react-navigation/native";
import DropdownButton from "./DropdownButton";
//


export default function Page() {
  const [users, setUsers] = useState([]);
  const { user } = useAuthenticator();

  const {signOut} = useAuthenticator();
  const navigation = useNavigation();

  useEffect(() => {
    // fetch users
    DataStore.query(User).then(setUsers);
  }, []);

  const handleDropdownSelect = (selectedItem) => {
    // Implement logic based on the selected item
    switch (selectedItem) {
      case 'newPost':
        // Handle "New Post" action
        <Link style={{ fontWeight: '500', fontSize: 20 }} href={'/newPost'}/>;
        break;
      case 'bio':
        // Handle "Bio" action
        <Link style={{ fontWeight: '500', fontSize: 20 }} href={'/ProfileScreen4'}/>;
        break;
      case 'signOut':
        // Handle "Sign Out" action
        <Text style={{ fontWeight: '500', fontSize: 20 }} onPress={() => signOut()}/>;
        break;
      default:
        break;
    }
  };
//        <DropdownButton onSelect={handleDropdownSelect} />  // this goes in return in the first View box

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 0 }}>


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

      <Link style={{ fontWeight: '500', fontSize: 20 }} href={'/ProfileScreen4'}>
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
