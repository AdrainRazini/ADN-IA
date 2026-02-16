// public/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:"AIzaSyC3OWyHNEoqy5Kjo67VCGPqoOcZaVBtAGk",
  authDomain:"adn-ia.firebaseapp.com",
  projectId:"adn-ia",
  storageBucket:"adn-ia.firebasestorage.app",
  messagingSenderId:"426651405733",
  appId:"1:426651405733:web:0a05d8f7c321ed6008ac4c",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { app, auth, db, provider };

// Conexão com os Dados 