import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyAS6JZZFfvmFQzwSZrvp1mjWJe7WRMVL08",
    authDomain: "notes-app-db9bf.firebaseapp.com",
    databaseURL: "https://notes-app-db9bf-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "notes-app-db9bf",
    storageBucket: "notes-app-db9bf.appspot.com",
    messagingSenderId: "940166574604",
    appId: "1:940166574604:web:fccede6bc16e4f074e3429"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
export const auth = firebase.auth();
export const database = firebase.database();

