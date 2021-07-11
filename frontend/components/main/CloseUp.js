import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

require('firebase/firestore')

function CloseUp(props) {
  const [closeup, setCloseup ] = useState("")
  const [caption, setCaption] = useState("")
  const [userName, setUserName] = useState("")
  
  useEffect(() => {
    setCloseup(props.route.params.uri)
    setCaption(props.route.params.caption)
    setUserName(props.route.params.userName)

  }, [props.route.params.postId, props.users])

  if(closeup.length == 0) {
    return (<View></View>)
  }

  return (

        <View style={styles.containerImage}>
          <Image
            style={styles.image}
            source={{ uri: closeup}}
          />
          
        <View style={styles.container}>
          <Text style={styles.caption}>
            {caption}
          </Text>

          <Text style={styles.caption}>
            Posted By: {userName}
          </Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  containerImage: {
    flex: 1
  },
  image: {

    width: 450,
    height: 500,
  },
  caption: {
    textAlign: 'center',
    fontFamily: "Cochin",
    fontSize: 20,
    fontWeight: "bold"
  }
})

export default CloseUp;
 