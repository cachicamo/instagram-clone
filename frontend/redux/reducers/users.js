import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USERS_LOADED_STATE_CHANGE, USERS_LIKES_STATE_CHANGE,CLEAR_DATA } from '../constants/index'

const inititalState = {
  users: [],
  feed: [],
  usersFollowingLoaded: 0
  
}

export const users = (state = inititalState, action) => {
  switch(action.type){
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.user]
      }
    case USERS_POSTS_STATE_CHANGE:
      return {
        ...state,
        usersFollowingLoaded: state.usersFollowingLoaded + 1,
        feed: [...state.feed, ...action.posts]
      }
    case USERS_LOADED_STATE_CHANGE:
      return {
        ...state,
        usersFollowingLoaded: state.usersFollowingLoaded - 1
      }
    case USERS_LIKES_STATE_CHANGE:
      return {
        ...state,
        feed: state.feed.map(post => post.id == action.postId ?
           {...post, currentUserLike: action.currentUserLike} : 
           post )
      } 
    case CLEAR_DATA:
      return inititalState

    default:
      return state;
  }
}