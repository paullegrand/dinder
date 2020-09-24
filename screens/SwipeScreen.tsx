import React, { useRef, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Animated, Dimensions, Image, PanResponder, StyleSheet, View } from 'react-native';
import FoodCard from '../components/FoodCard';
import DinderGradient from '../components/DinderGradient';
import SwipeButtons from '../components/SwipeButtons'
// @ts-ignore: No declaration for .js file
import { swipeRequested } from '../ducks/session';
// @ts-ignore: No declaration for .js file
import { selectFoodItems } from '../ducks/food';
import { FoodItem } from '../models/FoodItem';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

interface Props {
  foodItems: Array<FoodItem>;
  swipeFood: ({ key, swipedRight }: { key: string, swipedRight: boolean }) => void;
}

const SwipeScreen = ({ foodItems, swipeFood }: Props) => {
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
          restSpeedThreshold: 100,
          restDisplacementThreshold: 200,
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
          toValue: { x: -SCREEN_WIDTH - 120, y: gestureState.dy },
          restSpeedThreshold: 100,
          restDisplacementThreshold: 200,
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

  // Pass this to whatever actually does the swiping
  const handleSwipe = useCallback((key: string, currentValue: boolean) => swipeFood({ key, swipedRight: !currentValue }), [swipeFood])

  return (
    <View style={styles.container}>
      <SwipeButtons
        currentIndex={currentIndex}
      />

      {foodItems && foodItems.length > 0 && (foodItems[currentIndex]) &&
        <DinderGradient
          colors={foodItems[currentIndex].colors}
          style={{
            flex: 1
          }}
        />
      }

      {foodItems.map((foodItem, i) => {
        if (i < currentIndex)
          return null

        if (i == currentIndex) {
          return (
            // The current card
            <Animated.View
              {...panResponder.panHandlers}
              key={foodItem.key}
              style={{ ...styles.card, ...currentCardStyle }}
            >
              <FoodCard
                likeOpacity={likeOpacity}
                dislikeOpacity={dislikeOpacity}
                food={foodItem}
              />
            </Animated.View>
          )
        } else if (i == currentIndex + 1) {
          // The "next" card to pre-render below the current card
          return (
            <Animated.View
              key={foodItem.key}
              style={{ ...styles.card, ...nextCardStyle }}
            >
              <FoodCard
                likeOpacity={zeroOpacity}
                dislikeOpacity={zeroOpacity}
                food={foodItem}
              />
            </Animated.View>
          )
        } else {
          // Draw the remaining cards but with 0 opacity to preload the images
          return (
            <Animated.View
              key={foodItem.key}
              style={{ ...styles.card, ...{ opacity: 0 } }}
            >
              <FoodCard
                likeOpacity={zeroOpacity}
                dislikeOpacity={zeroOpacity}
                food={foodItem}
              />
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
  }
});

const mapStateToProps = (state: object) => ({
  foodItems: selectFoodItems(state),
})

const mapDispatchToProps = {
  swipeFood: swipeRequested,
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipeScreen)
