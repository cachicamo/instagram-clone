import React, { Component } from 'react'
import { View, Button, TextInput, StyleSheet } from 'react-native'
import firebase from 'firebase'

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }

    this.onSignIn = this.onSignIn.bind(this)
  }

  onSignIn() {
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
        window.alert(err.message)
      })
  }

  render() {
    return (
      <View>
        <TextInput 
          style={styles.input}
          autoFocus
          placeholder="Enter email..."
          autoCorrect={false}
          autoCapitalize="none"
          autoCompleteType="off"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput 
          style={styles.input}
          placeholder="Enter email..."
          autoCapitalize="none"
          autoCompleteType="password"
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <Button 
          title="Sign In"
          onPress={() => this.onSignIn()}
        />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    fontSize: 28,
    height: 80,
    margin: 24,
    borderWidth: 1,
    padding: 10
  },
});

export default Login
