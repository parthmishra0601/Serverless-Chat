// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcMdwWYFhKZ88h2EvQ-Of_6mG15N04cm4",
  authDomain: "reactchat-40424.firebaseapp.com",
  projectId: "reactchat-40424",
  storageBucket: "reactchat-40424.firebasestorage.app",
  messagingSenderId: "95388710378",
  appId: "1:95388710378:web:7cf50cd2d1520265e0ae93",
  measurementId: "G-1L0R59BBQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);
export {auth,app}