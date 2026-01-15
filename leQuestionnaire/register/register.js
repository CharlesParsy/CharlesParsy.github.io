import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("registerBtn");

btn.onclick = async () => {
    try {
        const res = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        await setDoc(doc(db, "users", res.user.uid), {
            email: email.value,
            createdAt: serverTimestamp()
        });

        window.location.href = "dashboard.html";
    } catch (e) {
        alert("Erreur : " + e.message);
    }
};
