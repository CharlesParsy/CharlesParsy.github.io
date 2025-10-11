import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, deleteDoc, addDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBrsi_SS-Tz02U5jYFgYTPEJVYywqS14wc",
    authDomain: "testquiz-6c8b7.firebaseapp.com",
    projectId: "testquiz-6c8b7",
    storageBucket: "testquiz-6c8b7.firebasestorage.app",
    messagingSenderId: "166793498577",
    appId: "1:166793498577:web:ff371eb47f556922d49af0",
    measurementId: "G-E2DEX1Z7J3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let questions = [];
let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let selectedCategory = "";

// --- Charger les catégories depuis Firestore ---
export async function loadCategories() {
    const docRef = doc(db, "categories", "liste");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        return snap.data().noms;
    } else {
        return null;
    }
}

// 🟩 Lancer le quiz
export async function startQuiz() {
    selectedCategory = document.getElementById("category").value;
    const nb = parseInt(document.getElementById("nbQuestions").value);

    if (!selectedCategory) return alert("Choisissez une catégorie !");
    if (isNaN(nb) || nb <= 0) return alert("Entrez un nombre valide !");

    const snapshot = await getDocs(collection(db, selectedCategory));
    questions = snapshot.docs.map(doc => doc.data());

    if (nb > questions.length) return alert("Pas assez de questions dans cette catégorie !");

    quizQuestions = shuffleArray([...questions]).slice(0, nb);

    document.getElementById("setup").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    score = 0;
    currentIndex = 0;
    loadQuestion();
}

export function loadQuestion() {
    const q = quizQuestions[currentIndex];
    document.getElementById("result").textContent = "";
    document.getElementById("gif").style.display = "none";
    document.getElementById("question").textContent = `Question ${currentIndex + 1} : ${q.intitule}`;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    const allAnswers = [...(q.propositions || []), q.reponse].sort(() => Math.random() - 0.5);
    allAnswers.forEach(ans => {
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.addEventListener("click", () => checkAnswer(btn, ans, q.reponse));
        answersDiv.appendChild(btn);
    });
    document.getElementById("nextBtn").style.display = "none";
}

export function checkAnswer(selectedBtn, choice, correct) {
    const buttons = document.querySelectorAll("#answers button");
    buttons.forEach(btn => btn.disabled = true);

    if (choice === correct) {
        selectedBtn.classList.add("correct");
        document.getElementById("result").textContent = "✅ Bonne réponse !";
        score++;
        playBravo();
    } else {
        selectedBtn.classList.add("wrong");
        document.getElementById("result").textContent = "❌ Mauvaise réponse !";
        buttons.forEach(btn => {
            if (btn.textContent === correct) btn.classList.add("correct");
        });
    }
    document.getElementById("nextBtn").style.display = "inline-block";
}

export function nextQuestion() {
    currentIndex++;
    if (currentIndex < quizQuestions.length) loadQuestion();
    else endQuiz();
}

export function endQuiz() {
    document.getElementById("gif").style.display = "none";
    document.getElementById("quiz").style.display = "none";
    document.getElementById("end").style.display = "block";
    document.getElementById("score").textContent = `Score final : ${score} / ${quizQuestions.length}`;
}

export function restartQuiz() {
    document.getElementById("end").style.display = "none";
    document.getElementById("setup").style.display = "block";
}

export function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

export function playBravo() {
    const gif = document.getElementById("gif");
    gif.style.display = "block";
    gif.currentTime = 0;
    gif.play();
}

export function logout() {
    signOut(auth).catch(() => {});
    localStorage.removeItem("adminConnected");
    window.location.href = "login.html";
}
//
// export async function loadQuestions() {
//     const category = document.getElementById("categorie").value;
//     const container = document.getElementById("list");
//     container.innerHTML = "Chargement...";
//
//     try {
//         const snapshot = await getDocs(collection(db, category));
//         container.innerHTML = "";
//
//         if (snapshot.empty) {
//             container.innerHTML = "<p>Aucune question trouvée dans cette catégorie.</p>";
//             return;
//         }
//
//         snapshot.forEach(docSnap => {
//             const q = docSnap.data();
//             const card = document.createElement("div");
//             card.className = "question";
//             card.innerHTML = `
//                 <p><strong>Question :</strong> ${q.intitule}</p>
//                 <p><strong>Bonne réponse :</strong> ${q.reponse}</p>
//                 <p><strong>Propositions :</strong> ${q.propositions.join(", ")}</p>
//                 <p><strong>Solution :</strong> ${q.solution || ""}</p>
//             `;
//
//             const delBtn = document.createElement("button");
//             delBtn.textContent = "Supprimer";
//             delBtn.addEventListener("click", async () => {
//                 if (confirm("Supprimer cette question ?")) {
//                     await deleteDoc(doc(db, category, docSnap.id));
//                     card.remove();
//                     document.getElementById("message").textContent =
//                         "✅ Question supprimée avec succès.";
//                 }
//             });
//
//             const modBtn = document.createElement("button");
//             modBtn.textContent = "Modifier";
//             modBtn.addEventListener("click", () => {
//                 localStorage.setItem("editCat", category);
//                 localStorage.setItem("editId", docSnap.id);
//                 window.location.href = "modifier.html";
//             });
//
//             card.appendChild(delBtn);
//             card.appendChild(modBtn);
//             container.appendChild(card);
//         });
//     } catch (e) {
//         console.error("Erreur de chargement :", e);
//         container.innerHTML = "<p>❌ Erreur lors du chargement des questions.</p>";
//     }
// }

// 🔹 Récupère les questions d’une catégorie et retourne un tableau avec id + data
export async function getQuestionsByCategory(category) {
    const snapshot = await getDocs(collection(db, category));
    const questions = [];
    snapshot.forEach(docSnap => {
        questions.push({ id: docSnap.id, ...docSnap.data() });
    });
    return questions;
}


export async function getNbQuestions(category) {
    try {
        const snapshot = await getDocs(collection(db, category));
        return snapshot.size;
    } catch (e) {
        console.error("Erreur de chargement :", e);
    }
}


export async function addQuestionWithCategory(event) {
    event.preventDefault();

    const selectCat = document.getElementById("categorie").value;
    const newCat = document.getElementById("newCategorie").value.trim();
    const categorie = newCat || selectCat;
    const message = document.getElementById("message");

    if (!categorie) {
        message.style.color = "red";
        message.textContent = "⚠️ Choisissez ou créez une catégorie.";
        return;
    }

    const intitule = document.getElementById("intitule").value.trim();
    const reponse = document.getElementById("reponse").value.trim();
    const prop1 = document.getElementById("prop1").value.trim();
    const prop2 = document.getElementById("prop2").value.trim();
    const prop3 = document.getElementById("prop3").value.trim();
    const prop4 = document.getElementById("prop4").value.trim();
    const solution = document.getElementById("solution").value.trim();

    if (!intitule || !reponse || !prop1 || !prop2 || !prop3 || !prop4) {
        message.style.color = "red";
        message.textContent = "⚠️ Merci de remplir tous les champs obligatoires.";
        return;
    }

    // 🟢 Ajout du champ solution
    const question = {
        intitule,
        reponse,
        propositions: [prop1, prop2, prop3, prop4],
        solution: solution || ""
    };

    try {
        // 🔹 Met à jour la liste des catégories si besoin
        const catRef = doc(db, "categories", "liste");
        const snap = await getDoc(catRef);

        if (snap.exists()) {
            const data = snap.data();
            const noms = data.noms || [];
            if (!noms.includes(categorie)) {
                noms.push(categorie);
                await updateDoc(catRef, { noms });
            }
        } else {
            await setDoc(catRef, { noms: [categorie] });
        }

        // 🔹 Ajoute la question à la collection correspondante
        await addDoc(collection(db, categorie), question);

        message.style.color = "green";
        message.textContent = `✅ Question ajoutée dans "${categorie}" !`;

        document.getElementById("form").reset();
    } catch (error) {
        console.error("Erreur :", error);
        message.style.color = "red";
        message.textContent = "❌ Erreur : " + error.message;
    }
}