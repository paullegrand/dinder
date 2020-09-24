import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
// @ts-ignore: No declaration for .js file
import { getFoodRequested } from '../ducks/food';

interface Props {
  loadFood: () => void;
}

const SplashScreen = ({ loadFood }: Props) => {
  const navigation = useNavigation();

  useEffect(() => {
    loadFood();
  }, [])
  
  const [fontsLoaded] = useFonts({
    'Sacramento': require('./../assets/fonts/Sacramento.ttf'),
    'Raleway-SemiBold': require('./../assets/fonts/Raleway-SemiBold.ttf'),
    'Raleway-LightItalic': require('./../assets/fonts/Raleway-LightItalic.ttf')
  });

  if (!fontsLoaded)
    return <AppLoading />

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60 }}></View>

      <View style={styles.container}>
        <Text style={styles.headerText}>Dinder</Text>

        <Image
          style={styles.burger}
          source={require('./../assets/icons/burger.png')}
        />

        <Text style={styles.subTitle}>
          Dinner's decided.
        </Text>

        <Text style={styles.subText}>
          Swipe right on the foods you're interested in, and we'll find a match.
        </Text>

        <View style={styles.start}>
          <Button
            title="Start swiping"
            onPress={() => navigation.navigate('Session')}
          />
        </View>
      </View>

      <View style={{ height: 60 }}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    padding: 10,
    fontSize: 32,
    fontWeight: '400',
    color: '#e900ff',
    textAlign: 'center',
    fontFamily: 'Sacramento'
  },
  subTitle: {
    padding: 10,
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Raleway-SemiBold',
    textAlign: 'center',
    color: '#3D144C'
  },
  subText: {
    paddingHorizontal: 60,
    paddingTop: 20,
    fontFamily: 'Raleway-LightItalic',
    lineHeight: 21,
    fontSize: 18,
    textAlign: 'center',
    color: '#737373',
  },
  burger: {
    padding: 10,
    height: '40%',
    resizeMode: 'center'
  },
  start: {
    marginTop: 20,
  }
});

const mapDispatchToProps = {
  loadFood: getFoodRequested,
}

export default connect(null, mapDispatchToProps)(SplashScreen)
