import firebase from 'firebase';
const config = {
  apiKey: "AIzaSyAp9F0XYi5YS6Oue515LGoMXD-QsMcQA6k",
  authDomain: "smarttodo-react.firebaseapp.com",
  databaseURL: "https://smarttodo-react.firebaseio.com",
  projectId: "smarttodo-react",
  storageBucket: "smarttodo-react.appspot.com",
  messagingSenderId: "362040526997"
};
firebase.initializeApp(config);
export default firebase;