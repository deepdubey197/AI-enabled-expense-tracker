// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmRV8o46oQLCPCcPpqYcRb_rTdkiEKp9Y",
  authDomain: "expense-tracker-baef4.firebaseapp.com",
  projectId: "expense-tracker-baef4",
  storageBucket: "expense-tracker-baef4.appspot.com",
  messagingSenderId: "42967243191",
  appId: "1:42967243191:web:a53b0ea4ad90e281747032"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const provider=new GoogleAuthProvider();
export const db=getFirestore(app);

//firebase login
//firebase init
//firebase deploy