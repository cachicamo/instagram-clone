import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Button, Text, Image, FlatList } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from '../../redux/actions'
import { connect } from 'react-redux'


function Profile(props) {

  const [ user, setUser ] = useState(null)
  const [ userPosts, setUserPosts ] = useState([])
  const [ following, setFollowing ] = useState(false)

  useEffect(() => {
    const { currentUser, posts } = props;

    function getIndex(item) {
      return props.following.findIndex(obj => obj.id === item);
    }

    if(props.route.params.uid === firebase.auth().currentUser.uid) {
      // current user profile check
      setUser(currentUser)
      setUserPosts(posts)
    } else {
      //fetch user
      firebase.firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if(snapshot.exists) {
            setUser(snapshot.data())
          } else {
            console.log('does not exist')
          }
        })

      //fetch user Posts
      firebase.firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("createdAt", 'asc')
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return{ id, ...data }
          })
          setUserPosts(posts)
        })
    }

    if(getIndex(props.route.params.uid) > -1) {
      setFollowing(true)
    } else {
      setFollowing(false)
    }
  }, [props.route.params.uid, props.route.params, props.following])

  const onFollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({})
  }

  const onUnfollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete()
    props.clearData()
    props.fetchUser();
    props.fetchUserPosts();
  }

  const goFeed = () => {
    props.clearData()
    props.fetchUser();
    props.fetchUserPosts();
    // props.fetchUserFollowing();
    props.navigation.navigate("Feed")
  }

  const onLogout = () => {
    firebase.auth().signOut();
  }

  if(user === null){
    return <View />
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>

        { props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            { following ? (
              <Button 
                title="Following"
                onPress={() => {
                  onUnfollow()
                   } }
              />
            ) : (
              <Button 
                title="Follow"
                onPress={() => {
                  onFollow()
                   }}
              />
            )}
          </View>
        ) : 
          <Button 
            title="Logout"
            onPress={() => onLogout()}
          /> 
        }
      </View>

      <View style={styles.containerGallery}>
        <FlatList 
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}> 
              <Image
                style={styles.image}
                source={{ uri: item.downloadURL }}
                onClick={() => props.navigation.navigate("CloseUp",
                  { caption: item.caption, uri: item.downloadURL })}
              />
            </View> 
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10
  },
  containerInfo: {
    margin: 5,
    padding: 10
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1/3
  },
  image: {
    aspectRatio: 1 / 1,
    width: 120,
    height: 120,
    margin: 4

  },
})

// access redux
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following 
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Profile)