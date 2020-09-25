import React from 'react';
import { connect } from 'react-redux';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
// @ts-ignore: No declaration for .js file
import { selectSession } from '../ducks/session';
// @ts-ignore: No declaration for .js file
import { selectFoodItems } from '../ducks/food';
import { FoodItem } from '../models/FoodItem';
import { Session } from '../models/Session';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

interface Props {
  foodItems: Array<FoodItem>;
  session: Session;
}

const MatchesScreen = ({ foodItems, session }: Props) => {
  // Gross way to see what matches are in the state
  const matchedFoodKeys =
    session && session.swipes
      ? Object.keys(session.swipes).filter(
        food =>
          Object.keys(session.swipes[food]).length > 1 &&
          Object.keys(session.swipes[food]).every(
            value => session.swipes[food][value] === true,
          ),
      )
      : [];

  const matchedFoods = matchedFoodKeys && matchedFoodKeys.length > 0
    ? foodItems.filter(({ key }) => matchedFoodKeys.includes(key))
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.cardRoot}>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.header}>Matches</Text>
            <Text style={styles.subText}>
              {matchedFoods.length > 0
                ? `You ${session.users.length == 2 ? 'both' : 'each'} swiped right on these foods`
                : `No matches!`}
            </Text>
          </View>
          {matchedFoods.length > 0 && (
            <ScrollView style={styles.scrollView}>
              {matchedFoods.map(match => (
                <View key={match.key} style={styles.match}>
                  <Text style={styles.matchText}>{match.name}</Text>
                </View>
              ))}
              <View style={styles.spacer} />
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E2E2E2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRoot: {
    position: 'relative',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 30,
  },
  cardTop: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  header: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    lineHeight: 34,
  },
  subText: {
    fontFamily: 'Raleway-LightItalic',
    fontSize: 16,
    color: '#737373',
    textAlign: 'center',
  },
  scrollView: {
    flexGrow: 0,
    maxHeight: SCREEN_HEIGHT - 350,
    paddingHorizontal: 15,
  },
  match: {
    width: SCREEN_WIDTH - 100,
    backgroundColor: '#F52789',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 7,
    borderRadius: 5,
  },
  matchText: {
    color: '#FFF',
    fontFamily: 'Raleway-SemiBold',
    fontSize: 15,
  },
  spacer: {
    height: 15,
  },
})

const mapStateToProps = (state: object) => ({
  session: selectSession(state),
  foodItems: selectFoodItems(state),
})

export default connect(mapStateToProps)(MatchesScreen)
