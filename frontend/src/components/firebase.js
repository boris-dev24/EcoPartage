import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore" 
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = { 
    apiKey: "AIzaSyCwuxUzHleXsjTMTm5ixMFB_VYsyFmBj8Q", 
    authDomain: "ecopartage-9bc85.firebaseapp.com", 
    projectId: "ecopartage-9bc85", 
    storageBucket: "ecopartage-9bc85.firebasestorage.app", 
    messagingSenderId: "93690454738", 
    appId: "1:93690454738:web:a71f63884f7a336480430b", 
    measurementId: "G-1MR9C6XK4N" 
}; 


    const app = initializeApp(firebaseConfig); 
    const auth = getAuth(app); 
    const db = getFirestore(app); 
    const imageDb = getStorage(app)
    export { auth, db ,imageDb}; 
    export default app; 