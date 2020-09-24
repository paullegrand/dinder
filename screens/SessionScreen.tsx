import React from 'react';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import { connect } from 'react-redux';
import { Alert, Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import DinderGradient from '../components/DinderGradient';
import NewSessionOption from '../components/NewSessionOption';
import { joinRequested, createRequested } from '../ducks/session';

const SCREEN_WIDTH = Dimensions.get('window').width

interface Props {
  joinSession: (sessionId: string) => void;
  createSession: () => void;
}

const SessionScreen = ({ joinSession, createSession }: Props) => {
  let [fontsLoaded] = useFonts({
    'Raleway-SemiBoldItalic': require('./../assets/fonts/Raleway-SemiBoldItalic.ttf')
  });

  // @TODO: show the user the code so they can share it before continuing
  const requestNewSession = () => {
    createSession()
  }

  const requestJoinSession = (sessionId: string) => {
    joinSession(sessionId)
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
        <NewSessionOption
          isInput={true}
          topText={'_ _ _ _'}
          bottomText={'Enter the 4-letter code to join an existing group'}
          joinSession={requestJoinSession}
        />
      </View>

      <TouchableHighlight
        style={styles.sessionOptionContainer}
        onPress={requestNewSession}
      >
        <NewSessionOption
          isInput={false}
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
    textShadowOffset: { width: -1, height: 1 },
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

const mapDispatchToProps = {
  joinSession: joinRequested,
  createSession: createRequested,
}

export default connect(null, mapDispatchToProps)(SessionScreen)
