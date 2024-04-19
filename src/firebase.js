// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGmeKsZ0Ss7vjbgHn8w7lD6N6F_ruUMSE",
  authDomain: "baitaplon-ltnc.firebaseapp.com",
  projectId: "baitaplon-ltnc",
  storageBucket: "baitaplon-ltnc.appspot.com",
  messagingSenderId: "604616970132",
  appId: "1:604616970132:web:c627e20c58a671ff30c981",
  measurementId: "G-CBNQNBH8TT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebase = getFirestore(app);

export { firebase };