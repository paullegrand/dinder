import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

const DinderGradient = (props) => {
  return (
    <LinearGradient
      colors={props.colors}
      style={styles.gradient}
      start={{
        x: 0,
        y: 0
      }}
      end={{
        x: 1,
        y: 1
      }}
    />
  )
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    opacity: 0.5,
    left: 0,
    right: 0,
    top: 0,
    height: '100%'
  }
});

export default DinderGradient;
