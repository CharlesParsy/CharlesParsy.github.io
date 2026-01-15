import { auth } from "../firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("loginBtn");

btn.onclick = async () => {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        window.location.href = "../dashboard";
    } catch (e) {
        alert("Erreur : " + e.message);
    }
};
