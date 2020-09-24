import React from 'react';
import { SplashScreen } from './screens/SplashScreen';
import { SessionScreen } from './screens/SessionScreen';
import { SwipeScreen } from './screens/SwipeScreen';

export default class App extends React.Component {
  constructor() {
    super()

    this.state = {
      sessionId: null,
      showStart: true,
    }
  }

  sessionHandler = ({ sessionId }) => {
    this.setState({
      sessionId: sessionId
    })
  }

  startHandler = () => {
    this.setState({
      showStart: false
    })
  }

  render() {
    // Initial state. Show the start page, and then choose session
    if (this.state.sessionId === null) {
      // Show the start page? Or go to the choose session page?
      if (this.state.showStart) {
        return (
          <SplashScreen
            startHandler={this.startHandler}
          />
        )
      }
      else {
        // @TODO: Add choose session page
        return (
          <SessionScreen
            sessionHandler={this.sessionHandler}
          />
        )
      }
    }
    // Have a session ID... let's get swiping!
    else {
      return (
        <SwipeScreen />
      );
    }
  }
}
