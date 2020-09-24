import { createAction, handleActions } from 'redux-actions';

import { myFirebase } from '../firebase/firebase';

const authAction = name => createAction(`auth/${name}`);
const authState = state => state.auth;

const initialState = {
    isLoggingIn: false,
    isVerifying: false,
    loginError: null,
    verifyError: null,
    isAuthenticated: false,
    user: {},
};

// actions
export const loginRequested = authAction('LOGIN_REQUESTED');
export const loginSucceeded = authAction('LOGIN_SUCCEEDED');
export const loginFailed = authAction('LOGIN_FAILED');
export const verifyRequested = authAction('VERIFY_REQUESTED');
export const verifySucceeded = authAction('VERIFY_SUCCEEDED');

// reducer
export default handleActions(
    {
        [loginRequested]: state => ({
            ...state,
            isLoggingIn: true,
        }),
        [loginSucceeded]: (state, { payload: { user } }) => ({
            ...state,
            isLoggingIn: false,
            isAuthenticated: true,
            user,
        }),
        [loginFailed]: (state, { payload: { loginError = null } }) => ({
            ...state,
            isLoggingIn: false,
            isAuthenticated: false,
            loginError,
        }),
        [verifyRequested]: state => ({
            ...state,
            isVerifying: false,
        }),
        [verifySucceeded]: (state, { payload: verifyError = null }) => ({
            ...state,
            isVerifying: false,
            verifyError,
        }),
    },
    initialState,
);

// thunks
export const loginAnonymousUser = () => dispatch => {
    dispatch(loginRequested());
    try {
        myFirebase.auth().signInAnonymously();
    } catch (loginError) {
        dispatch(loginFailed({ loginError }));
    }
};

export const verifyAuth = () => dispatch => {
    dispatch(verifyRequested());
    try {
        myFirebase.auth().onAuthStateChanged(user => {
            if (user) {
                dispatch(loginSucceeded({ user }));
            } else {
                dispatch(loginAnonymousUser());
            }
            dispatch(verifySucceeded());
        });
    } catch (verifyError) {
        dispatch(verifySucceeded({ verifyError }));
    }
};

// selectors
export const selectIsAuthenticated = state => authState(state).isAuthenticated;
export const selectIsVerifying = state => authState(state).isVerifying;
export const selectUser = state => authState(state).user;
