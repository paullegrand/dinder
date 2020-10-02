import { all, takeLatest } from 'redux-saga/effects';
import { sessionSaga } from './session';
import { foodSaga } from './food';
import { verifySucceeded } from './auth';

export default function* rootSaga() {
    yield all([takeLatest(verifySucceeded, sessionSaga), foodSaga()]);
}
