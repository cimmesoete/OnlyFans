import { Text, StyleSheet, FlatList, View } from "react-native";
// import React from "react"
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import users from "../../assets/data/users";
import { useEffect, useState } from 'react';
import UserProfileHeader from "../../src/components/UserProfileHeader";
import posts from "../../assets/data/posts";
import Post from "../../src/components/Post";
import { FontAwesome } from '@expo/vector-icons';
import { DataStore } from "aws-amplify/lib-esm";
import { User } from "../../src/models";

const ProfilePage = () => {
    const [user, setUser] = useState();
    const [isSubscribed, setIsSubscribed] = useState(false);

    const { id } = useLocalSearchParams();

    useEffect(() => {
        DataStore.query(User, id).then(setUser);
    }, [id])

//    const user = users.find((u) => u.id == id);

    if (!user) {
        return <Text onPress={() => router.back()}>User not found! Go back</Text>;

    }

    if (!isSubscribed) {
        return (
            <View>
                <UserProfileHeader 
                    user={user} 
                    isSubscribed={isSubscribed} 
                    setIsSubscribed={setIsSubscribed} 
                />

                <View style={{ 
                    backgroundColor: 'gainsboro', 
                    alignItems: 'center',
                    padding:20,
                }}>
                    <FontAwesome name="lock" size={50} color="gray" />
                    <Text style={{ 
                        backgroundColor: 'royalblue', 
                        height: 50, 
                        borderRadius: 25,
                        overflow: 'hidden',
                        padding: 15,
                        color: 'white',
                        margin: 20,
                    }}
                    > 
                        Subscribe to see user's posts
                    </Text>
                </View>
                
            </View>
        );
    }

    return (
        <FlatList 
            data={posts} 
            renderItem={({item}) => <Post post={item} />} 
            ListHeaderComponent={() => (
                <UserProfileHeader 
                    user={user} 
                    isSubscribed={isSubscribed} 
                    setIsSubscribed={setIsSubscribed} 
                />
            )}
        />
    );
};

const styles = StyleSheet.create({});
export default ProfilePage;