import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, Animated } from 'react-native';

export default class LikeOrDislikeButton extends Component {
  static propTypes = {
    isLikeButton: PropTypes.bool.isRequired,
    opacity: PropTypes.object,
  }

  render() {
    const buttonText = this.props.isLikeButton ? 'LIKE' : 'NOPE';
    const color = this.props.isLikeButton ? 'green' : 'red';

    return (
      <Animated.View
        style={[this.props.isLikeButton ? styles.dinderLike : styles.dinderDislike, {
          opacity: this.props.opacity
        }]}
      >
        <Text
          style={{
            borderWidth: 1,
            borderColor: color,
            color: color,
            fontSize: 32,
            fontWeight: '800',
            padding: 10
          }}
        >
          {buttonText}
        </Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  dinderLike: {
    transform: [{
      rotate: '-30deg'
    }],
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 1000,
  },
  dinderDislike: {
      transform: [{
        rotate: '30deg'
      }],
      position: 'absolute',
      top: 50,
      right: 40,
      zIndex: 1000,
  }
});
