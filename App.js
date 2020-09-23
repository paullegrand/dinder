import React from 'react';
// Library Components
import { StyleSheet, Button, Text, View, Dimensions, Image, Animated, PanResponder, Alert }   from 'react-native';
import { LinearGradient }                                                                     from 'expo-linear-gradient';
import { AppLoading }                                                                         from 'expo';
import { useFonts }                                                                           from 'expo-font';

// Custom Components
import LikeOrDislikeButton  from './components/LikeOrDislikeButton';
import StartPage            from './components/StartPage';
import GetSession           from './components/GetSession';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const Users = [
  { id: "1", uri: require('./assets/images/1.jpg') },
  { id: "2", uri: require('./assets/images/2.jpg') },
  { id: "3", uri: require('./assets/images/3.jpg') },
  { id: "4", uri: require('./assets/images/4.jpg') },
  { id: "5", uri: require('./assets/images/5.jpg') },
]

export default class App extends React.Component {
  constructor() {
    super()

    this.position = new Animated.ValueXY()

    this.state = {
      currentIndex: 0,
      sessionId: null,
      showStart: true,
    }

    this.sessionHandler = this.sessionHandler.bind(this)

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH /2 ,0, SCREEN_WIDTH /2],
      outputRange: ['-30deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })
    this.zeroOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })

  }

  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
            useNativeDriver: false
          }).start(() => {
            // @TODO: Add logic for liking a food
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
            useNativeDriver: false
          }).start(() => {
            // @TODO: Add logic for disliking a food
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false
          }).start()
        }
      }
    })
  }

  renderUsers = () => {

    return Users.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null
      }
      // Current card in the stack
      else if (i == this.state.currentIndex) {

        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id}
            style={[
              this.rotateAndTranslate,
              {
                height: SCREEN_HEIGHT - 120,
                width: SCREEN_WIDTH,
                padding: 10,
                position: 'absolute'
              }
            ]}
          >
            {/* Like button */}
            <LikeOrDislikeButton
              isLikeButton={true}
              opacity={this.likeOpacity} />

            {/* Dislike Button */}
            <LikeOrDislikeButton
              isLikeButton={false}
              opacity={this.dislikeOpacity} />

            {/* <LinearGradient
              colors={[
                'red',
                'yellow',
                'green'
              ]}
              style={styles.LinearGradient}
            > */}
              <Image
                style={{
                  flex: 1,
                  height: null,
                  width: null,
                  resizeMode: 'cover',
                  borderRadius: 20
                }}
                source={item.uri}
              />
            {/* </LinearGradient> */}
          </Animated.View>
        )
      }
      // Cards below in the stack
      else {
        return (
          <Animated.View
            key={item.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
              height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute'
            }]}
          >
            {/* Hidden buttons, but... ready for later I guess? */}
            <LikeOrDislikeButton
              isLikeButton={true}
              opacity={this.zeroOpacity} />

            <LikeOrDislikeButton
              isLikeButton={false}
              opacity={this.zeroOpacity} />

            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
              source={item.uri} />

          </Animated.View>
        )
      }
    }).reverse()
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
    if (this.state.sessionId === null)
    {
      // Show the start page? Or go to the choose session page?
      if (this.state.showStart)
      {
        return (
          <StartPage
            startHandler={this.startHandler}
          />
        )
      }
      else {
        // @TODO: Add choose session page
        return (
          <GetSession
            sessionHandler={this.sessionHandler}
          />
        )
      }
    }
    // Have a session ID... let's get swiping!
    else
    {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ height: 120 }}></View>

          <View style={{ flex: 1 }}>
            {this.renderUsers()}
          </View>

          <View style={{ height: 120 }}></View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  fitToContent: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
})
