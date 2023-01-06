// Import the functions you need from the SDKs you need
import { initializeApp,getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgHuEYDj4RMjp9dYIeYjDVbNc0t6Ixu-w",
  authDomain: "netflix-clone-vaibhav.firebaseapp.com",
  projectId: "netflix-clone-vaibhav",
  storageBucket: "netflix-clone-vaibhav.appspot.com",
  messagingSenderId: "527754451525",
  appId: "1:527754451525:web:2bd3eb3ff8211331f8612c"
};

// Initialize Firebase


const app =!getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();


export default app;
export {db, auth};