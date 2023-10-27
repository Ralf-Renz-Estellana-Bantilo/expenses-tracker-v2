// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvyIza4CiPaME9XRH6SbF13hk5ASmguVU",
  authDomain: "personal-expenses-tracke-97a07.firebaseapp.com",
  projectId: "personal-expenses-tracke-97a07",
  storageBucket: "personal-expenses-tracke-97a07.appspot.com",
  messagingSenderId: "306413707972",
  appId: "1:306413707972:web:15ce19e1b0cbbe719edf91",
  measurementId: "G-LL4BYYSMEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
