import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("register-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const registerBtn = document.getElementById("register-btn");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");
// const passwordStrength = document.getElementById("password-strength");

// Vérifier la force du mot de passe
// passwordInput.addEventListener("input", () => {
//     const password = passwordInput.value;
//
//     if (password.length === 0) {
//         passwordStrength.classList.remove("show");
//         return;
//     }
//
//     passwordStrength.classList.add("show");
//
//     let strength = 0;
//     let feedback = "";
//
//     // Critères de force
//     if (password.length >= 6) strength++;
//     if (password.length >= 10) strength++;
//     if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
//     if (/\d/.test(password)) strength++;
//     if (/[^a-zA-Z0-9]/.test(password)) strength++;
//
//     // Affichage
//     passwordStrength.className = "password-strength show";
//
//     if (strength <= 2) {
//         passwordStrength.classList.add("strength-weak");
//         feedback = "⚠️ Mot de passe faible";
//     } else if (strength <= 4) {
//         passwordStrength.classList.add("strength-medium");
//         feedback = "👍 Mot de passe moyen";
//     } else {
//         passwordStrength.classList.add("strength-strong");
//         feedback = "✅ Mot de passe fort";
//     }
//
//     passwordStrength.textContent = feedback;
// });

// Validation du formulaire
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    hideMessages();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validations
    if (!email || !password || !confirmPassword) {
        showError("Veuillez remplir tous les champs");
        return;
    }

    if (!isValidEmail(email)) {
        showError("Adresse email invalide");
        return;
    }

    if (password.length < 6) {
        showError("Le mot de passe doit contenir au moins 6 caractères");
        return;
    }

    if (password !== confirmPassword) {
        showError("Les mots de passe ne correspondent pas");
        return;
    }

    // Désactiver le bouton pendant le traitement
    registerBtn.disabled = true;
    registerBtn.textContent = "Création en cours...";

    try {
        // Créer l'utilisateur avec Firebase Auth
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Créer le document utilisateur dans Firestore
        await setDoc(doc(db, "users", result.user.uid), {
            email: email,
            createdAt: serverTimestamp(),
        });

        showSuccess("Compte créé avec succès ! Redirection...");

        // Redirection vers le dashboard après 1.5 secondes
        setTimeout(() => {
            window.location.href = "../dashboard";
        }, 1500);

    } catch (error) {
        console.error("Erreur d'inscription:", error);
        handleFirebaseError(error);
        registerBtn.disabled = false;
        registerBtn.textContent = "S'inscrire";
    }
});

// Validation email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Gestion des erreurs Firebase
function handleFirebaseError(error) {
    let message = "Une erreur est survenue. Veuillez réessayer.";

    switch (error.code) {
        case "auth/email-already-in-use":
            message = "Cette adresse email est déjà utilisée";
            break;
        case "auth/invalid-email":
            message = "Adresse email invalide";
            break;
        case "auth/operation-not-allowed":
            message = "L'inscription est temporairement désactivée";
            break;
        case "auth/weak-password":
            message = "Le mot de passe est trop faible";
            break;
        case "auth/network-request-failed":
            message = "Erreur de connexion. Vérifiez votre connexion internet";
            break;
        default:
            message = `Erreur: ${error.message}`;
    }

    showError(message);
}

// Afficher un message d'erreur
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    successMessage.classList.remove("show");
}

// Afficher un message de succès
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add("show");
    errorMessage.classList.remove("show");
}

// Cacher les messages
function hideMessages() {
    errorMessage.classList.remove("show");
    successMessage.classList.remove("show");
}