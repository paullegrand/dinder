import React from 'react';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import { Alert, Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import DinderGradient from '../components/DinderGradient';
import NewSessionOption from '../components/NewSessionOption';

const SCREEN_WIDTH = Dimensions.get('window').width

const SessionScreen = (props) => {
  let [fontsLoaded] = useFonts({
    'Raleway-SemiBoldItalic':   require('./../assets/fonts/Raleway-SemiBoldItalic.ttf')
  });

  const requestNewSession = () => {
    Alert.alert('Requesting to start a new session!')

    setTimeout(() => {
      setSessionId('newSessionId')
    }, 1000)
  }

  const requestJoinSession = () => {
    Alert.alert('Requesting to join a session!')

    // @TODO: Ask the user for input, and then verify that session exists before joining it
    setTimeout(() => {
      setSessionId('joiningSession')
    }, 500)
  }

  const setSessionId = (newSessionId: string) => {
    props.sessionHandler(newSessionId)
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

      <TouchableHighlight
        style={styles.sessionOptionContainer}
        onPress={requestJoinSession}
      >
        <NewSessionOption
          topText={'_ _ _ _'}
          bottomText={'Enter the 4-letter code to join an existing group'}
        />
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.sessionOptionContainer}
        onPress={requestNewSession}
      >
        <NewSessionOption
          topText={'Create Group'}
          bottomText={'Create a new group and invite your friends'}
        />
      </TouchableHighlight>
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
    textShadowRadius: 10,
  },
  sessionOptionContainer: {
    marginHorizontal: 25,
    marginTop: 45,
    position: 'relative',
    width: SCREEN_WIDTH,
    height: 150,
  },
});

export default SessionScreen
