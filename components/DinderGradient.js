import React, { Component } from 'react';
import { Text, StyleSheet, View, Button, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
    ></LinearGradient>
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
