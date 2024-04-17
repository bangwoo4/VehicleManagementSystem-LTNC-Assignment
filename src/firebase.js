// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCl0MCoRcu84nWhMRYFT69RgnV5XKK01Rk",
  authDomain: "btl-ltnc-b9c5c.firebaseapp.com",
  databaseURL: "https://btl-ltnc-b9c5c-default-rtdb.firebaseio.com",
  projectId: "btl-ltnc-b9c5c",
  storageBucket: "btl-ltnc-b9c5c.appspot.com",
  messagingSenderId: "49679657316",
  appId: "1:49679657316:web:0a29675d68ad1fba0fb271",
  measurementId: "G-FZ01WN2HD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebase = getFirestore(app);

export { firebase };