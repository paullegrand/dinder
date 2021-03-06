import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DinderGradient from '../components/DinderGradient';
import NewSessionOption from '../components/NewSessionOption';
// @ts-ignore: No declaration for .js file
import { joinRequested, createRequested } from '../ducks/session';

const SCREEN_WIDTH = Dimensions.get('window').width

interface Props {
  joinSession: (sessionId: string) => void;
  createSession: () => void;
}

const SessionScreen = ({ joinSession, createSession }: Props) => {
  // @TODO: show the user the code so they can share it before continuing
  const requestNewSession = useCallback(() => {
    createSession()
  }, [createSession])

  const requestJoinSession = useCallback((sessionId: string) => {
    joinSession(sessionId)
  }, [joinSession])

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
          joinSession={requestJoinSession}
          bottomText={'Enter a 4-letter code to join an existing group'}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.sessionOptionContainer}
        onPress={requestNewSession}
      >
        <NewSessionOption
          isInput={false}
          topText={'Create Group'}
          bottomText={'Create a new group and invite your friends'}
        />
      </TouchableOpacity>
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
