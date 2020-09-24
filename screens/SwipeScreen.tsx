import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, PanResponder, StyleSheet, Text, View } from 'react-native';
import LikeOrDislikeButton from '../components/LikeOrDislikeButton';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

// temporary until we incorporate Firebase
const foods = [
  { id: "1", uri: require('../assets/images/1.jpg') },
  { id: "2", uri: require('../assets/images/2.jpg') },
  { id: "3", uri: require('../assets/images/3.jpg') },
  { id: "4", uri: require('../assets/images/4.jpg') },
  { id: "5", uri: require('../assets/images/5.jpg') },
]

// TODO: connect redux so we can dispatch actions
const SwipeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const pan = useRef(new Animated.ValueXY()).current

  const currentCardStyle = {
    transform: [
      {
        rotate: pan.x.interpolate({
          inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
          outputRange: ['-30deg', '0deg', '10deg'],
          extrapolate: 'clamp'
        })
      },
      { translateX: pan.x },
      { translateY: pan.y },
    ]
  }

  const nextCardStyle = {
    opacity: pan.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    }),
    transform: [{
      scale: pan.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0.8, 1],
        extrapolate: 'clamp'
      })
    }],
  }

  const likeOpacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  })

  const dislikeOpacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp'
  })

  const zeroOpacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 0],
    extrapolate: 'clamp'
  })

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderMove: Animated.event([
      null,
      {
        dx: pan.x,
        dy: pan.y,
      }
    ], { useNativeDriver: false }),

    onPanResponderRelease: (_evt, gestureState) => {
      // Swipe right
      if (gestureState.dx > 120) {
        Animated.spring(pan, {
          toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
          useNativeDriver: true
        }).start(() => {
          // @TODO: Add logic for liking a food
          setCurrentIndex(currentIndex + 1)
          pan.setValue({ x: 0, y: 0 })
        })
      }
      // Swipe right
      else if (gestureState.dx < -120) {
        Animated.spring(pan, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
          useNativeDriver: true
        }).start(() => {
          // @TODO: Add logic for disliking a food
          setCurrentIndex(currentIndex + 1)
          pan.setValue({ x: 0, y: 0 })
        })
      }
      // Release the card
      else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: true
        }).start()
      }
    }
  })

  return (
    <View style={styles.container}>
      {foods.map((food, i) => {
        if (i < currentIndex) return null

        // Current card in the stack
        if (i == currentIndex) {
          return (
            <Animated.View
              {...panResponder.panHandlers}
              key={food.id}
              style={{ ...styles.card, ...currentCardStyle }}
            >
              {/* Like button */}
              <LikeOrDislikeButton
                isLikeButton={true}
                opacity={likeOpacity} />
              {/* Dislike Button */}
              <LikeOrDislikeButton
                isLikeButton={false}
                opacity={dislikeOpacity} />
              {/* <LinearGradient
                colors={[
                  'red',
                  'yellow',
                  'green'
                ]}
                style={styles.LinearGradient}
              > */}
              <Image
                style={styles.image}
                source={food.uri} />
              {/* </LinearGradient> */}
            </Animated.View>
          )
        }
        // Cards below in the stack
        else {
          return (
            <Animated.View
              key={food.id}
              style={{ ...styles.card, ...nextCardStyle }}
            >
              {/* Hidden buttons, but... ready for later I guess? */}
              <LikeOrDislikeButton
                isLikeButton={true}
                opacity={zeroOpacity} />
              <LikeOrDislikeButton
                isLikeButton={false}
                opacity={zeroOpacity} />
              <Image
                style={styles.image}
                source={food.uri} />
            </Animated.View>
          )
        }
      }).reverse()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
  },
  image: {
    resizeMode: 'cover',
    borderRadius: 20,
    height: 300,
    width: 300,
  },
});

export default SwipeScreen
