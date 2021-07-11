import React, { Component } from 'react'
import { View, Button, TextInput, StyleSheet } from 'react-native'
import firebase from 'firebase'

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    }

    this.onSignUp = this.onSignUp.bind(this)
  }

  validateEntries() {
    if(this.state.name.length < 2) {
      return {error: "name must be more than one character"}
    }
    if(this.state.password !== this.state.confirmPassword) {
      return {error: "Passwords must match"}
    }
  }

  onSignUp() {
    const { email, password, confirmPassword, name } = this.state;
    let result = this.validateEntries(email, password, confirmPassword, name)

    if(result != null) {
      console.error(result.error)
      window.alert(result.error);

      return null
    } else {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // save to firestore database
        firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email
          })
      })
      .catch((err) => {
        console.error(err);
        window.alert(err.message);
      })
    }
  }

  render() {
    return (
      <View>
        <TextInput
          style={styles.input}
          autoFocus
          placeholder="name..."
          autoCorrect={false}
          autoCapitalize="none"
          autoCompleteType="off"
          onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter email..."
          autoCorrect={false}
          autoCapitalize="none"
          autoCompleteType="off"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          style={styles.input}
          placeholder="password..."
          autoCompleteType="password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <TextInput
          style={styles.input}
          placeholder="confirm password..."
          autoCompleteType="password"
          secureTextEntry={true}
          onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
        />
        <Button 
          onPress={() => this.onSignUp()}
          title="Sign Up"
        />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});

export default Register
