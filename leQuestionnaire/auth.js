import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function requireAuth(callback) {
    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.href = "../login";
        } else {
            callback(user);
        }
    });
}

export function logout() {
    signOut(auth).then(() => {
        window.location.href = "../login";
    });
}
