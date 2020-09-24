import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// @ts-ignore: No declaration for .js file
import { selectSessionId } from '../ducks/session';
import SplashScreen from '../screens/SplashScreen';
import SessionScreen from '../screens/SessionScreen';
import SwipeScreen from '../screens/SwipeScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  const sessionId = useSelector(selectSessionId)

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
          : <Stack.Screen name="Swipe" component={SwipeScreen} />}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
