import React from 'react'
import { useFonts } from 'expo-font'
import { Alert, Dimensions, StyleSheet, TouchableHighlight, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

const SCREEN_WIDTH = Dimensions.get('window').width

interface Props {
  currentIndex: number;
}

const SwipeButtons = ({ currentIndex }: Props) => {
  let [fontsLoaded] = useFonts({
    'Raleway':                  require('./../assets/fonts/Raleway-Regular.ttf'),
    'Raleway-SemiBold':     require('./../assets/fonts/Raleway-SemiBold.ttf'),
  });

  const rewind = () => {
    Alert.alert('SEND IT BACK')
  }

  const swipeLeft = () => {
    Alert.alert('Nah, not feelin it')
  }

  const swipeRight = () => {
    Alert.alert('Swiped right!')
  }

  let rewindEnabled   = (currentIndex !== 0)
  const buttonSize    = 28

  return (
    <View style={styles.container}>
        <TouchableHighlight
          style={[styles.child, rewindEnabled ? null : styles.buttonDisabled ]}
          onPress={rewind}
        >
          <AntDesign
            name="back"
            size={buttonSize}
            color={"#000"}
          />
        </TouchableHighlight>

        <TouchableHighlight
          onPress={swipeLeft}
          style={styles.child}
        >
          <AntDesign
            name="close"
            size={buttonSize}
            color="red"
          />
        </TouchableHighlight>

        <TouchableHighlight
          onPress={swipeRight}
          style={styles.child}
        >
          <AntDesign
            name="check"
            size={buttonSize}
            color="green"
          />
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    width: SCREEN_WIDTH,
    height: 150,
    zIndex: 600,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  child: {
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 50000, // This is a stupid way to do this but it works sooooooooooo
  },
  buttonDisabled: {
    opacity: 0.3,
  }
});

export default SwipeButtons;
