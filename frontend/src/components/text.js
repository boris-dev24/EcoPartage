// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACxb_rMVKJG2vNZhZ_JKwJ8ay3CYoMEss",
  authDomain: "ecoptest-b24bd.firebaseapp.com",
  projectId: "ecoptest-b24bd",
  storageBucket: "ecoptest-b24bd.firebasestorage.app",
  messagingSenderId: "756468005446",
  appId: "1:756468005446:web:4ab967c2e0ee62f97da847",
  measurementId: "G-PG5QLLZYY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);