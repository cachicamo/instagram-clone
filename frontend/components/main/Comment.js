import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, TextInput, StyleSheet } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'
// to connect to redux remove export default and export at bottom
// copied from Main.js and modified

function Comment(props) {
  const [comments, setComments] = useState([])
  const [postId, setPostId] = useState ("")
  const [text, setText] = useState ("")
  const [refresh, setRefresh] = useState(false)
  
  useEffect(() => {

    function matchUserToComment(comments) {
      for(let i =0; i< comments.length; i++){
        if(comments[i].hasOwnProperty('user')) {
          continue;
        }
        const user = props.users.find((x) => x.uid === comments[i].creator)
        if(user === undefined){
          props.fetchUsersData(comments[i].creator, false)
        } else {
          comments[i].user = user.name
        }
      }
      setComments(comments)
    }
    
    if(props.route.params.postId !== postId){
      firebase.firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .collection('comments')
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map(doc => {
            const data = doc.data()
            const id = doc.id
            return {id, ...data}
          })
          matchUserToComment(comments)
        })
      setPostId(props.route.params.postId)
    } else {
      matchUserToComment(comments)
    }

  }, [props.route.params.postId, props.users, text])

  const onCommentSend = () => {
    firebase.firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .collection('comments')
        .add({
          creator: firebase.auth().currentUser.uid,
          text
        });
  }

  return (
    <View>
    <FlatList 
      numColumns={1}
      horizontal={false}
      data={ comments }
      renderItem={({ item }) => (
        <View>
          { item.user !== undefined ? 
            <Text>
              -- {item.user} : {item.text}
            </Text>
          : <Text>** {item.text}</Text>  }
        </View>
      )}
    />
    
    <View>

    </View>
      <TextInput 
          style={styles.input}
          autoFocus
          placeholder='comment...'
          autoCorrect={false}
          autoCapitalize="none"
          autoCompleteType="off"
          onChangeText={(text) => setText(text)}
      />
      
      <Button 
        onPress={() => onCommentSend()}
        title="Send"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    fontSize: 28,
    height: 60,
    margin: 24,
    borderWidth: 1,
    padding: 10
  },
});

const mapStateToProps = (store) => ({
  users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment);
 