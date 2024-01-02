import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCtg6MCfLigWSeFOjDuClwVUNIQ3XQHn6M",
    authDomain: "todo-app-3b30a.firebaseapp.com",
    databaseURL: "https://todo-app-3b30a-default-rtdb.firebaseio.com",
    projectId: "todo-app-3b30a",
    storageBucket: "todo-app-3b30a.appspot.com",
    messagingSenderId: "593288234851",
    appId: "1:593288234851:web:947f97a23d54c1c05db556",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
