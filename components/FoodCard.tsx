import React from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { FoodItem } from '../models/FoodItem';
import { getFirebaseImageUrl } from '../utils/getFirebaseImageUrl';
import LikeOrDislikeButton from './LikeOrDislikeButton';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

interface Props {
  likeOpacity: Animated.AnimatedInterpolation,
  dislikeOpacity: Animated.AnimatedInterpolation,
  food: FoodItem,
}

const FoodCard = ({ likeOpacity, dislikeOpacity, food, ...rest }: Props) => {
  const source = { uri: getFirebaseImageUrl(food.key, food.imageToken) }
  
  return (
    <View key={food.key} style={styles.card} {...rest}>
      <View style={styles.imageStack}>
        <View style={styles.imageContainer}>
          <LikeOrDislikeButton isLikeButton={true} opacity={likeOpacity} />
          <LikeOrDislikeButton isLikeButton={false} opacity={dislikeOpacity} />
          <Image style={styles.image} source={source} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.topTextRow}>
          <Text style={styles.text}>{food.name}</Text>
          <Text style={styles.emoji}>{food.emoji}</Text>
        </View>
        <Text style={styles.subText}>{food.flavorText}</Text>
      </View>
    </View>
  )
}

const sizes = {
  imageSize: SCREEN_WIDTH - 100,
  cardWidth: SCREEN_WIDTH - 50,
  overlayOffset: 60,
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: sizes.cardWidth,
    alignItems: 'center',
    borderRadius: 5,
    padding: 25,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    marginTop: sizes.overlayOffset - 25,
  },
  imageStack: {
    height: sizes.imageSize,
    width: sizes.imageSize,
    marginTop: -sizes.overlayOffset,
    shadowOpacity: 0,
  },
  imageContainer: {
    position: 'absolute',
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  image: {
    resizeMode: 'cover',
    borderRadius: 5,
    height: sizes.imageSize,
    width: sizes.imageSize,
  },
  textContainer: {
    width: '100%',
    marginTop: 25,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  topTextRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: 24,
    color: '#333',
  },
  emoji: {
    fontSize: 14,
  },
  subText: {
    fontFamily: 'Raleway-LightItalic',
    fontSize: 16,
    color: '#737373',
  }
});

export default FoodCard
