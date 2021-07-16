// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase'
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyB5cRsQOes65SgLgKMkKfSdqs6D-wpx-YE",
    authDomain: "fb-clone-4a0d3.firebaseapp.com",
    projectId: "fb-clone-4a0d3",
    storageBucket: "fb-clone-4a0d3.appspot.com",
    messagingSenderId: "616867499703",
    appId: "1:616867499703:web:3e835e4d8276e1ab8b4732",
    measurementId: "G-L2DR7MFEEJ"
  };

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const storage = firebase.storage();

export {db,storage} ;