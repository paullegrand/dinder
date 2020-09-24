import { combineReducers } from 'redux';

import authReducer from './auth';
import sessionReducer from './session';
import foodReducer from './food';

const rootReducer = combineReducers({
    auth: authReducer,
    session: sessionReducer,
    food: foodReducer,
});

export default rootReducer;
