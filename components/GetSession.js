import React, { Component } from 'react';
import { Text, StyleSheet, View, Button, Alert, Image } from 'react-native';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

const GetSession = (props) => {
  let [fontsLoaded] = useFonts({
    'Sacramento':           require('./../assets/fonts/Sacramento.ttf'),
    'Raleway-SemiBold':     require('./../assets/fonts/Raleway-SemiBold.ttf'),
    'Raleway-LightItalic':  require('./../assets/fonts/Raleway-LightItalic.ttf')
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
        {/* @TODO: Add session thingy here */}
      {/* <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 300,
        }}
        start={{
          x: 0,
          y: 0
        }}
        end={{
            x: 1,
            y: 1
        }}
    ></LinearGradient> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default GetSession;
