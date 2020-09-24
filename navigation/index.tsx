import React, { useState } from 'react';
import { SplashScreen } from '../screens/SplashScreen';
import { SessionScreen } from '../screens/SessionScreen';
import { SwipeScreen } from '../screens/SwipeScreen';

// TODO: replace with react-navigation
export const Navigation = () => {
  const [sessionId, setSessionId] = useState(null)
  const [showStart, setShowStart] = useState(true)

  // Initial state. Show the start page, and then choose session
  if (!sessionId) {
    // Show the start page? Or go to the choose session page?
    if (showStart) {
      return <SplashScreen startHandler={() => setShowStart(false)} />
    } else {
      return <SessionScreen sessionHandler={setSessionId} />
    }
  }
  // Have a session ID... let's get swiping!
  else {
    return <SwipeScreen />;
  }
}
