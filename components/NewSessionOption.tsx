import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width

interface Props {
  isInput: boolean;
  topText: string;
  bottomText: string;
  joinSession?: (sessionId: string) => void;
}

const NewSessionOption = ({ isInput, topText, bottomText, joinSession }: Props) => {

  const onChangeText = useCallback((text: string) => {
    // Make sure we're at a valid code before we try to do something
    if (text.length !== 4)
      return
    if (joinSession !== undefined)
      joinSession(text);
  }, [joinSession])

  return (
    <View>
      <View style={styles.sessionOptionTop}>
        {isInput
          ? <TextInput
              style={[styles.sessionOptionTextTop, styles.letterSpacingWide]}
              onChangeText={text => onChangeText(text)}
              placeholder={topText}
              placeholderTextColor={'#fff'}
            />
          : <Text style={styles.sessionOptionTextTop}>{topText}</Text>
        }
      </View>

      <View style={styles.sessionOptionBottom}>
        <Text style={styles.sessionOptionTextBottom}>{bottomText}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sessionOptionTop: {
    marginHorizontal: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH - 80,
    height: 60,
    zIndex: 501,
    backgroundColor: '#3D144C',
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  sessionOptionBottom: {
    paddingTop: 30,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 25,
    left: 0,
    width: SCREEN_WIDTH - 50,
    zIndex: 500,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  sessionOptionTextTop: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: 24,
    color: '#fff',
    paddingTop: 15,
    textAlign: 'center',
    textAlignVertical: 'bottom',
  },
  letterSpacingWide: {
    letterSpacing: 5,
  },
  sessionOptionTextBottom: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    fontFamily: 'Raleway',
    fontSize: 18,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 21,
  }
});

export default NewSessionOption;
