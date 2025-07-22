// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ams-estates.firebaseapp.com",
  projectId: "ams-estates",
  storageBucket: "ams-estates.appspot.com",
  messagingSenderId: "968380831245",
  appId: "1:968380831245:web:6f7ef3e6f2c07286526744"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
