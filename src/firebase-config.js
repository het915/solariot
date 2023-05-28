import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getDatabase} from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDdAXUxGEW7hlN-1fZCkjFW_OGR1WwC2E8",
  authDomain: "solariot-93516.firebaseapp.com",
  databaseURL:
    "https://solariot-93516-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "solariot-93516",
  storageBucket: "solariot-93516.appspot.com",
  messagingSenderId: "418972515836",
  appId: "1:418972515836:web:ebd6e5c5ea76cba8404679",
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getDatabase(app)