import React, { useState, useEffect, Component } from 'react'
import { StyleSheet, View, Button, Text, Image, FlatList, Pressable } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from '../../redux/actions/index'


const Separator = () => (
  <View style={styles.separator} />
);

const onLikePress = (userId, postId) => {
  firebase.firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({})
}

const onDislikePress = (userId, postId) => {
  firebase.firestore()
    .collection("posts")
    .doc(userId)
    .collection("userPosts")
    .doc(postId)
    .collection("likes")
    .doc(firebase.auth().currentUser.uid)
    .delete()
}

function Feed(props) {
  const [ posts, setPosts ] = useState([])

  useEffect(() => {
    // if(props.usersFollowingLoaded !== props.following.length || props.following.length > 0){
      fetchUser();
      fetchUserPosts();
      fetchUserFollowing({uid: firebase.auth().currentUser.uid});
      props.feed.sort(function(x,y) {
        return y.createdAt - x.createdAt;
      })
      setPosts(props.feed)
    // }
  }, [props.usersFollowingLoaded, props.feed, props.following])

  useEffect(() => {
    console.log('changed feed')
  },[props.following])


  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList 
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Pressable onPress={() => props.navigation.navigate("Profile",
                  { uid: item.user.uid, usersFollowing: props.usersFollowing})}>
              <Text 
                style={styles.nameText}
                
              >{item.user.name}</Text>
              </Pressable>
              <Pressable onPress={() => props.navigation.navigate("CloseUp",
                  { userName: item.user.name, caption: item.caption, uri: item.downloadURL })}>
              <Image
                style={styles.image}
                source={{ uri: item.downloadURL }}
               />
              </Pressable>
              { item.currentUserLike ?
                  <Button 
                    title="Dislike"
                    onPress={() => onDislikePress(item.user.uid, item.id)}
                  /> : 
                  <Button 
                    title="Like"
                    onPress={() => onLikePress(item.user.uid, item.id)}
                  />
                }
              <Text 
                style={styles.commentText}
                onPress={() => props.navigation.navigate("Comment",
                  { postId: item.id, uid: item.user.uid })
               }>
              View Comments...
              </Text>
              <Separator />
            </View> 
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 8
  },
  containerInfo: {
    margin: 10
  },
  containerGallery: {
    paddingLeft: 10,
    flex: 0, // comment for ios
  },
  containerImage: {
    flex: 1 / 3
  },
  image: {
    flex: 0,
    aspectRatio: 1 / 1,
    paddingLeft: 5,
    width: 130,  // comment for ios
    height: 165, // comment for ios
  },
  commentText: {
    padding: '4px',
    textAlign: 'center'
  },
  nameText: {
    fontStyle: "italic",
    backgroundColor: "lightblue"
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})

// access redux
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
  following: store.userState.following 
})

export default connect(mapStateToProps, null)(Feed)