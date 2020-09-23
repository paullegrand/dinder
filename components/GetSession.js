import React, { Component } from 'react';
import { Text, StyleSheet, View, Button, Alert, Image } from 'react-native';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';

// Custom Components
import DinderGradient from './DinderGradient';

const GetSession = (props) => {
  let [fontsLoaded] = useFonts({
    'Sacramento':               require('./../assets/fonts/Sacramento.ttf'),
    'Raleway-SemiBold':         require('./../assets/fonts/Raleway-SemiBold.ttf'),
    'Raleway-SemiBoldItalic':   require('./../assets/fonts/Raleway-SemiBoldItalic.ttf')
  });

  requestNewSession = () => {
    Alert.alert('Requesting to start a new session!')

    // @TODO: How are we generating session IDs?
    setSessionId('newSessionId')
  }

  requestJoinSession = () => {
    Alert.alert('Requesting to join a session!')

    // @TODO: Ask the user for input, and then verify that session exists before joining it
    setSessionId('randomSessionId')
  }

  setSessionId = (newSessionId) => {
    props.sessionHandler({ sessionId: newSessionId })
  }

  if (!fontsLoaded)
    return <AppLoading />

  return (
    <View style={{
      flex: 1,
    }}>
      <DinderGradient
        colors={['#1685F8', '#E900FF']}
      ></DinderGradient>

      <View>
        <Text style={styles.header}>Choose one.</Text>
      </View>

      <View style={styles.sessionOptionContainer}>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    paddingTop: 120,
    fontSize: 24,
    fontFamily: 'Raleway-SemiBoldItalic',
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  sessionOptionContainer: {

  }
});

export default GetSession;
