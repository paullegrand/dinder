import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// @ts-ignore: No declaration for .js file
import { selectSessionId } from '../ducks/session';
import SplashScreen from '../screens/SplashScreen';
import SessionScreen from '../screens/SessionScreen';
import SwipeScreen from '../screens/SwipeScreen';
import MatchesScreen from '../screens/MatchesScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  const sessionId = useSelector(selectSessionId)
  const [swipingComplete, setSwipingComplete] = useState(false)
  const onSwipingComplete = useCallback(() => setSwipingComplete(true), [setSwipingComplete])

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        {!sessionId
          ? (
            <>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Session" component={SessionScreen} />
            </>
          )
          : !swipingComplete
            ? (
              <Stack.Screen name="Swipe">
                {props => <SwipeScreen {...props} onSwipingComplete={onSwipingComplete} />}
              </Stack.Screen>
            )
            : <Stack.Screen name="Matches" component={MatchesScreen} />}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
