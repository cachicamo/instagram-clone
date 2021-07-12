import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import firebase from 'firebase';

//redux 
import { Provider } from 'react-redux';
import { store } from './redux/store'

// load keys
import {API_KEY, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID} from '@env'

// aplication screens
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'
import ProfileScreen from './components/main/Profile'
import CloseUpScreen from './components/main/CloseUp'


const Stack = createStackNavigator();

// firebase configuration 
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "porrello-gram.firebaseapp.com",
  projectId: "porrello-gram",
  storageBucket: "porrello-gram.appspot.com",
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

if (firebase.apps.length === 0) {
  console.log(MESSAGING_SENDER_ID)
  firebase.initializeApp(firebaseConfig);
}

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false
    }
  }
  
  componentDidMount(){
    // check if user logged in and set state
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded){
      return(
        <View style={ {flex: 1, justifyContent: 'center'} }>
            <Text>Loading...</Text>
          </View>
        )
      }
      if(!loggedIn) {
        return (
          <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={ LandingScreen } options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={ RegisterScreen }/>
            <Stack.Screen name="Login" component={ LoginScreen }/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    
    return (
      //redux wrapper
      <Provider store={ store }>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Porrello-Gram">
              <Stack.Screen name="Porrello-Gram" component={ MainScreen } />
              <Stack.Screen name="Add" component={ AddScreen } navigation={ this.props.navigation } />
              <Stack.Screen name="Save" component={ SaveScreen } navigation={ this.props.navigation } />
              <Stack.Screen name="Comment" component={ CommentScreen } navigation={ this.props.navigation } />
              <Stack.Screen name="Profile" component={ ProfileScreen } navigation={ this.props.navigation } />
              <Stack.Screen name="CloseUp" component={ CloseUpScreen } navigation={ this.props.navigation } />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App
