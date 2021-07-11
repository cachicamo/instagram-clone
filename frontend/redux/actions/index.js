import firebase from 'firebase'
require('firebase/firestore')

import { 
  USER_STATE_CHANGE, 
  USER_POSTS_STATE_CHANGE, 
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USERS_LOADED_STATE_CHANGE,
  USERS_LIKES_STATE_CHANGE,
  CLEAR_DATA
  } from '../constants'

export function clearData() {
  return ((dispatch) => {
      dispatch({type: CLEAR_DATA})
  })
}

export function fetchUser() {
  return((dispatch) => {
    firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if(snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
        } else {
          console.log('user_uid does not exist')
        }
      })
  })
}

export function fetchUserPosts() {
  return((dispatch) => {

    firebase.firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .orderBy("createdAt", 'asc')
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return{ id, ...data }
        })
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts: posts })
      })
  })
}

export function fetchUserFollowing() {
  return((dispatch) => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map(doc => {
          const id = doc.id;
          return {id} 
        })
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following })
        for(let i=0; i < following.length; i++){
          dispatch(fetchUsersData(following[i].id, true));
        }
      })
  })
}

export function fetchUsersData(uid, getPosts) {
  return ((dispatch, getState) => {
    const found = getState().usersState.users.some(el => el.uid === uid);
    if(!found) {
      firebase.firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        if(snapshot.exists) {
          let user = snapshot.data()
          user.uid = snapshot.id
          dispatch({ type: USERS_DATA_STATE_CHANGE, user})
        } else {
          console.log('does not exist')
        }
      })
      if(getPosts){
        dispatch(fetchUsersFollowingPosts(uid));
      }
    } 
  })
}

export function fetchUsersFollowingPosts(uid) {
  let tempuid = uid
  return((dispatch, getState) => {
    firebase.firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("createdAt", 'asc')
      .get()
      .then((snapshot) => {
        const user = getState().usersState.users.find(el => el.uid === tempuid);
        // const uid = snapshot.query.EP.path.segments[1];
        const uid = user.uid
        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return{ id, ...data, user }
        })

        for(let i=0; i< posts.length; i++){
          dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
        }
        // console.log(posts)
        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid})
        // console.log(getState())
      })
    })
  }

  export function updateUsersFollowingLoaded() {
    return(dispatch) => {
    dispatch({ type: USERS_LOADED_STATE_CHANGE })
    }
  }
  
  export function fetchUsersFollowingLikes(uid, postId) {
    let temppostId = postId
    return ((dispatch, getState) => {
      firebase.firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        const postId = temppostId
        let currentUserLike = false;
        if(snapshot.exists){
            currentUserLike = true;
        }

        dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
      })
  })
}