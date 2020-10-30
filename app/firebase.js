import firebase from "firebase/app"
import "firebase/auth"
import "firebase/analytics"
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBSKN5n-L4O7vP4wiuToJyFiGxq-SdBYiQ",
  authDomain: "bluffs-auth.firebaseapp.com",
  databaseURL: "https://bluffs-auth.firebaseio.com",
  projectId: "bluffs-auth",
  storageBucket: "bluffs-auth.appspot.com",
  messagingSenderId: "865539517764",
  appId: "1:865539517764:web:4969bc2e427c1e9397bb11",
  measurementId: "G-J964CRZC4N"
}
firebase.initializeApp(firebaseConfig)
firebase.analytics()

export default firebase
export const firestore = firebase.firestore()
