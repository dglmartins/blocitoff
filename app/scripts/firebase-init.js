// Initialize Firebase
var config = {
  apiKey: "AIzaSyBVm8sMwpfE1PpwG4UChec_BCpMuvGBpyo",
  authDomain: "blocitoff-262a5.firebaseapp.com",
  databaseURL: "https://blocitoff-262a5.firebaseio.com",
  storageBucket: "blocitoff-262a5.appspot.com",
  messagingSenderId: "57623987282"
};
firebase.initializeApp(config);
const firebaseDbRef = firebase.database().ref();
