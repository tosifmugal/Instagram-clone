import firebase from 'firebase';
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAXybKx2U05prjd7vvVfitEUG101F13ujg",
  authDomain: "instagram-clone-mirza.firebaseapp.com",
  databaseURL: "https://instagram-clone-mirza.firebaseio.com",
  projectId: "instagram-clone-mirza",
  storageBucket: "instagram-clone-mirza.appspot.com",
  messagingSenderId: "921278179633",
  appId: "1:921278179633:web:e3460a4903ce4c67406810",
  measurementId: "G-H7T68BC9TQ" 
    });
    const db = firebaseApp.firestore();
    const auth = firebase.auth();
    const storage= firebase.storage()
    export { db ,auth,storage };