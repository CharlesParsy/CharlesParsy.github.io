import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBji3V6czLJokXkaF_X0Hxw6Xub4E0d_lw",
    authDomain: "questionnaires-94850.firebaseapp.com",
    projectId: "questionnaires-94850",
    storageBucket: "questionnaires-94850.firebasestorage.app",
    messagingSenderId: "95052768462",
    appId: "1:95052768462:web:81ed1c8f2a7e5bba039c9f",
    measurementId: "G-2Y0KE9LVLT"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
