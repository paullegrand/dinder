import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
// @ts-ignore: No declaration for .js file
import { selectSession } from '../ducks/session';
// @ts-ignore: No declaration for .js file
import { selectFoodItems } from '../ducks/food';
import { FoodItem } from '../models/FoodItem';
import { Session } from '../models/Session';

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
    <View>
      Matches!
    </View>
  );
}

const mapStateToProps = (state: object) =>({
  session: selectSession(state),
  foodItems: selectFoodItems(state), 
})

export default connect(mapStateToProps)(MatchesScreen)
