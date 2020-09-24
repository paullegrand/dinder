import { createAction, handleActions } from 'redux-actions';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { rsfDatabase } from '../firebase/firebase';

const foodAction = name => createAction(`food/${name}`);
const foodState = state => state.food;

const initialState = {
    items: null,
    loading: false,
};

// actions
export const getFoodRequested = foodAction('GET_FOOD_REQUESTED');
export const getFoodSucceeded = foodAction('GET_FOOD_SUCCEEDED');
export const getFoodFailed = foodAction('GET_FOOD_FAILED');

// reducer
export default handleActions(
    {
        [getFoodRequested]: state => ({
            ...state,
            loading: true,
        }),
        [getFoodSucceeded]: (state, { payload: items }) => ({
            ...state,
            items,
            loading: false,
        }),
        [getFoodFailed]: (state, { payload: getFoodError }) => ({
            ...state,
            loading: false,
            getFoodError,
        }),
    },
    initialState,
);

// sagas
function* getFood() {
    try {
        const itemsAsObject = yield call(rsfDatabase.read, 'foods');
        const items = Object.keys(itemsAsObject).map(item => {
            let colors;
            if (itemsAsObject[item].colors !== undefined) {
                colors = (itemsAsObject[item].colors)
                    .replace(/\[|\]|'|\s+/g,'')
                    .split(',')
            } else {
                colors = itemsAsObject[item].colors;
            }
            return ({
                key: item,
                ...itemsAsObject[item],
                colors,
            })
        });
        yield put(getFoodSucceeded(items));
    } catch (error) {
        yield put(
            getFoodFailed(
                'Error getting food items, most likely related to a firebase operation',
            ),
        );
    }
}

export function* foodSaga() {
    yield all([takeLatest(getFoodRequested, getFood)]);
}

// selectors
export const selectFoodItems = state => foodState(state).items;
export const selectFoodItemsLoading = state => foodState(state).loading;
