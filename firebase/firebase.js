import firebase from 'firebase/app';
import ReduxSagaFirebase from 'redux-saga-firebase';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDAXDShwT-7KmE-zxy2eit-G74eS2Z-DXQ',
    authDomain: 'dinder-21708.firebaseapp.com',
    databaseURL: 'https://dinder-21708.firebaseio.com',
    projectId: 'dinder-21708',
    storageBucket: 'dinder-21708.appspot.com',
    messagingSenderId: '521917031410',
    appId: '1:521917031410:web:35b7a7ae0ac5711a25416b',
    measurementId: 'G-DK6Q58YNMT',
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
export const database = firebase.database();

export const reduxSagaFirebase = new ReduxSagaFirebase(myFirebase);
export const rsfDatabase = reduxSagaFirebase.database;

//https://redux-saga-firebase.js.org/
