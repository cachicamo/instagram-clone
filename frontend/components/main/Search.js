import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'

import firebase from 'firebase';
require('firebase/firestore');

export default function Search(props) {
  const [users, setUsers] = useState([{}]);
  
  const fetchUser = (search) => {
    firebase.firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return{ ...data, id }
        })
        setUsers(users)
      })
  }

  return (
    <View style={{flex: 1}}>
      <TextInput
        style={styles.input}
        autoFocus
        placeholder="Type name to search..." 
        autoCorrect={false}
        autoCapitalize="none"
        autoCompleteType="off"
        onChangeText={(search) => fetchUser(search)}
      />
      <FlatList
        numColumns={1}
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Profile", { uid: item.id })}
          >
            <Text style={styles.item}>{ item.name }</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: 'lightblue',
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    fontSize: 22
  },
  title: {
    fontSize: 20,
  },
  input: {
    fontSize: 28,
    height: 60,
    margin: 24,
    borderWidth: 1,
    padding: 12
  },
});
