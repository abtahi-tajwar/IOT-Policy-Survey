// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC-6JkIx3usr9DIu3GcqNhFcxel39ywwM",
  authDomain: "iot-policy-survey.firebaseapp.com",
  projectId: "iot-policy-survey",
  storageBucket: "iot-policy-survey.appspot.com",
  messagingSenderId: "1006766952498",
  appId: "1:1006766952498:web:a95c8763f5135755cf2c2b",
  measurementId: "G-HPMPF6R43R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app