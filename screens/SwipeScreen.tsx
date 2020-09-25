import React, { useRef, useState, useCallback, useEffect } from 'react';
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
  onSwipingComplete: () => void;
  swipeFood: ({ key, swipedRight }: { key: string, swipedRight: boolean }) => void;
}

const SwipeScreen = ({ foodItems, onSwipingComplete, swipeFood }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const pan = useRef(new Animated.ValueXY()).current

  // Hacky way of detecting when the user is done swiping
  useEffect(() => {
    if (currentIndex > foodItems.length - 1) {
      onSwipingComplete()
    }
  }, [currentIndex])

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
      if (gestureState.dx > 120) {
        handleSwipe(true, gestureState.dy)
      } else if (gestureState.dx < -120) {
        handleSwipe(false, gestureState.dy)
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: true
        }).start()
      }
    }
  })

  const handleSwipe = useCallback((swipedRight: boolean, dy?: number) => {
    const x = swipedRight ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 120
    const y = dy || -(SCREEN_HEIGHT / 3)

    Animated.spring(pan, {
      toValue: { x, y },
      restSpeedThreshold: 100,
      restDisplacementThreshold: 200,
      useNativeDriver: true
    }).start(() => {
      if (foodItems && foodItems[currentIndex]) {
        swipeFood({ key: foodItems[currentIndex].key, swipedRight })
        setCurrentIndex(currentIndex + 1)
      }
      pan.setValue({ x: 0, y: 0 })
    })
  }, [swipeFood, currentIndex, pan])

  const handleRewind = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      swipeFood({ key: foodItems[newIndex].key, swipedRight: false })
      setCurrentIndex(newIndex)
    }
  }, [currentIndex, setCurrentIndex])

  return (
    <View style={styles.container}>
      {foodItems && foodItems.length > 0 && (foodItems[currentIndex]) && (
        <>
          <SwipeButtons
            currentIndex={currentIndex}
            onSwipe={handleSwipe}
            onRewind={handleRewind}
          />
          <DinderGradient
            colors={foodItems[currentIndex].colors}
            style={{
              flex: 1
            }}
          />
        </>
      )}

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
