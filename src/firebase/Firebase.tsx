import firebase, { auth } from 'firebase';
import { FirebaseConfig } from '../config';

export const Firebase = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(FirebaseConfig);
    }
}

export const FirebaseAuth = () => {
    return firebase.auth();
}