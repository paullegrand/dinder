import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import { verifyAuth } from './ducks/auth';
import rootReducer from './ducks/rootReducer';
import rootSaga from './ducks/rootSaga';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunkMiddleware, sagaMiddleware];

export default function configureStore(persistedState) {
    const store = createStore(
        rootReducer,
        persistedState,
        composeEnhancers(applyMiddleware(...middlewares)),
    );

    store.dispatch(verifyAuth());

    sagaMiddleware.run(rootSaga);
    return store;
}
