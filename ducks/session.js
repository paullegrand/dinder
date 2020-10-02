import { createAction, handleActions } from 'redux-actions';
import {
    all,
    call,
    cancel,
    fork,
    put,
    select,
    take,
    takeLatest,
} from 'redux-saga/effects';

import { rsfDatabase } from '../firebase/firebase';
import { generateId } from '../utils/generateId';
import { selectUser } from './auth';

const sessionAction = name => createAction(`session/${name}`);
const sessionState = state => state.session;

const initialState = {
    sessionId: null,
    joinLoading: false,
    joinError: null,
    createLoading: false,
    createError: null,
    swipeLoading: false,
    swipeError: null,
    lastSwipe: null, //TODO:: this will contain ID for last item swiped--could be used to check if it was a match.
    session: null,
};

// actions
export const joinRequested = sessionAction('JOIN_REQUESTED');
export const joinSucceeded = sessionAction('JOIN_SUCCEEDED');
export const joinFailed = sessionAction('JOIN_FAILED');
export const createRequested = sessionAction('CREATE_REQUESTED');
export const createSucceeded = sessionAction('CREATE_SUCCEEDED');
export const createFailed = sessionAction('CREATE_FAILED');
export const swipeRequested = sessionAction('SWIPE_REQUESTED');
export const swipeSucceeded = sessionAction('SWIPE_SUCCEEDED');
export const swipeFailed = sessionAction('SWIPE_FAILED');
export const synced = sessionAction('SESSION_SYNCED');
export const ended = sessionAction('SESSION_ENDED');

// reducer
export default handleActions(
    {
        [joinRequested]: state => ({
            ...state,
            joinLoading: true,
        }),
        [joinSucceeded]: (state, { payload: { sessionId, session } }) => ({
            ...state,
            sessionId,
            session,
            joinLoading: false,
            joinError: null,
        }),
        [joinFailed]: (state, { payload: joinError }) => ({
            ...state,
            joinLoading: false,
            joinError,
        }),
        [createRequested]: state => ({
            ...state,
            createLoading: true,
        }),
        [createSucceeded]: (state, { payload: sessionId }) => ({
            ...state,
            sessionId,
            createLoading: false,
            createError: null,
        }),
        [createFailed]: (state, { payload: createError }) => ({
            ...state,
            createLoading: false,
            createError,
        }),
        [swipeRequested]: state => ({
            ...state,
            swipeLoading: true,
        }),
        [swipeSucceeded]: (state, { payload: lastSwipe }) => ({
            ...state,
            lastSwipe,
            swipeLoading: false,
            swipeError: null,
        }),
        [swipeFailed]: (state, { payload: swipeError }) => ({
            ...state,
            swipeLoading: false,
            swipeError,
        }),
        [synced]: (state, { payload: session }) => ({
            ...state,
            session,
        }),
        [ended]: () => ({
            ...initialState,
        }),
    },
    initialState,
);

// sagas
function* syncSession() {
    let sessionId = yield select(selectSessionId);
    if (!sessionId) {
        yield take(joinSucceeded);
        sessionId = yield select(selectSessionId);
    }
    let task = yield fork(rsfDatabase.sync, `sessions/${sessionId}`, {
        successActionCreator: synced,
    });

    yield take(ended);
    yield cancel(task);
}

// Join a session that already exists whether it was just created or created by another user
function* joinSession({ payload: sessionId }) {
    try {
        if (!sessionId) throw new Error('No session ID provided');
        const session = yield call(rsfDatabase.read, `sessions/${sessionId}`);
        if (session) {
            const { uid } = yield select(selectUser);

            // check to see if users array needs to be updated to include current user, whether we just created it or another user created it
            if (
                !session.users ||
                !session.users.length > 0 ||
                !session.users.includes(uid)
            ) {
                const users = session.users ? session.users.concat(uid) : [uid];
                yield call(rsfDatabase.patch, `sessions/${sessionId}`, {
                    users,
                });
            }

            yield put(joinSucceeded({ sessionId, session }));
        } else {
            yield put(joinFailed('Unable to join session'));
        }
    } catch (error) {
        yield put(
            joinFailed(
                'Error joining session, most likely related to a firebase operation. Extra details in console if applicable.',
            ),
        );
    }
}

// Create a new session then trigger join saga to join it
function* createSession() {
    // generate code using third party library
    const sessionId = generateId(4);
    const { uid } = yield select(selectUser);
    try {
        yield call(rsfDatabase.update, `sessions/${sessionId}`, {
            users: [uid],
        });
        yield put(createSucceeded(sessionId));
    } catch (error) {
        yield put(
            createFailed(
                'Error creating session, most likely related to a firebase operation. Extra details in console if applicable.',
            ),
        );
    }
}

// Swipe some of that tasty looking food
function* swipeFood({ payload: { key: foodKey, swipedRight } }) {
    const { uid } = yield select(selectUser);
    const sessionId = yield select(selectSessionId);
    try {
        if (!foodKey) throw new Error('No food key provided');
        if (!sessionId) throw new Error('No session ID found.');
        yield call(
            rsfDatabase.patch,
            `sessions/${sessionId}/swipes/${foodKey}`,
            {
                [uid]: swipedRight,
            },
        );
        yield put(swipeSucceeded(foodKey));
    } catch (error) {
        yield put(
            swipeFailed(
                'Error swiping on food item, most likely related to a firebase operation. Extra details in console if applicable.',
            ),
        );
    }
}

export function* sessionSaga() {
    yield all([
        call(syncSession),
        takeLatest([joinRequested, createSucceeded], joinSession),
        takeLatest(createRequested, createSession),
        takeLatest(swipeRequested, swipeFood),
    ]);
}

// selectors
export const selectSessionId = state => sessionState(state).sessionId;
export const selectSession = state => sessionState(state).session;
export const selectSessionErrors = state => ({
    joinError: sessionState(state).joinError,
    createError: sessionState(state).createError,
    swipeError: sessionState(state).swipeError,
});
export const selectLastFoodSwiped = state => sessionState(state).lastSwipe;
