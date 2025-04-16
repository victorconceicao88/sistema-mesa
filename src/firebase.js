// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔁 SUBSTITUA pelos dados do seu projeto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBbJmwq5Ia68S3UPhnaUerEl0paRdXQNqM",
    authDomain: "vivi-sala.firebaseapp.com",
    databaseURL: "https://vivi-sala-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "vivi-sala",
    storageBucket: "vivi-sala.firebasestorage.app",
    messagingSenderId: "1082904016563",
    appId: "1:1082904016563:web:044e5502b10e0ae4d922c6"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
