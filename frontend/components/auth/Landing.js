import React from 'react'
import { Text, View, Button, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'

const Separator = () => (
  <View style={styles.separator} />
);

export default function Landing({ navigation }) {
  return (
    <SafeAreaView> 
      <View style={styles.container}>
        <Text style={styles.title}> Porrello-Gram </Text>
          <Image
            style={styles.logo}
            source={require('../../assets/Bear.png')}
          />
      </View>
      <Separator />
      <View style={ styles.container }>
        
        <TouchableOpacity style={styles.loginButton}
          onPress={() => {
            navigation.navigate("Login")
          }}
        >
        <Text> Login </Text>
        </TouchableOpacity>
        <br></br>
        <Button 
          title="Register"
          onPress={() => {
            navigation.navigate("Register")
          }}
        />
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#cc20ee",
    marginVertical: 20
  },
  container: {
    paddingTop: 50,
    alignItems: "center",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 264,
    height: 200,
  },
  separator: {
    marginVertical: 16,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "lime",
    padding: 10
  },
});