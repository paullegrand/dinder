import React from 'react';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import { Alert, Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width

interface Props {
  isInput: boolean;
  topText: string;
  bottomText: string;
  joinSession?: (sessionId: string) => void;
}

const StartPage = ({ isInput, topText, bottomText, joinSession }: Props) => {
  let [fontsLoaded] = useFonts({
    'Raleway':                  require('./../assets/fonts/Raleway-Regular.ttf'),
    'Raleway-SemiBold':     require('./../assets/fonts/Raleway-SemiBold.ttf'),
  });

  const onChangeText = (text: string) => {
    // Make sure we're at a valid code before we try to do something
    if (text.length !== 4)
      return
    if (joinSession !== undefined)
      joinSession(text);
  }

  if (!fontsLoaded)
    return <AppLoading />

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
  },
  sessionOptionBottom: {
    paddingTop: 40,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 30,
    left: 0,
    width: SCREEN_WIDTH - 50,
    zIndex: 500,
    backgroundColor: '#fff',
    borderRadius: 5,
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
    fontFamily: 'Raleway',
    fontSize: 18,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 21,
  }
});

export default StartPage;
