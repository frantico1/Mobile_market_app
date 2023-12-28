// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAc0ieSLUMBzgE4ei5rQj0PSBW2VMimSLM',
  authDomain: 'market-barkod.firebaseapp.com',
  projectId: 'market-barkod',
  storageBucket: 'market-barkod.appspot.com',
  messagingSenderId: '918848001528',
  appId: '1:918848001528:web:e559fd03e3a713e347b20d',
  measurementId: 'G-TRRSS2GSS7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
