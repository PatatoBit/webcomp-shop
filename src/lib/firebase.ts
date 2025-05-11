// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCaj-0N7kfhueD4J5q9GOHLUlQ_Ba47HN8',
	authDomain: 'webcomp-e3ddd.firebaseapp.com',
	projectId: 'webcomp-e3ddd',
	storageBucket: 'webcomp-e3ddd.firebasestorage.app',
	messagingSenderId: '1054001640758',
	appId: '1:1054001640758:web:3b51d676ba1c0fd3e0af97',
	measurementId: 'G-51NGG4N76D'
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
