import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBrsi_SS-Tz02U5jYFgYTPEJVYywqS14wc",
    authDomain: "testquiz-6c8b7.firebaseapp.com",
    projectId: "testquiz-6c8b7",
    storageBucket: "testquiz-6c8b7.firebasestorage.app",
    messagingSenderId: "166793498577",
    appId: "1:166793498577:web:ff371eb47f556922d49af0",
    measurementId: "G-E2DEX1Z7J3"
};

// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
// import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// --- Charger les catégories depuis Firestore ---
export async function loadCategories() {
    const select = document.getElementById("category");
    select.innerHTML = "<option>Chargement...</option>";

    const docRef = doc(db, "categories", "liste");
    const snap = await getDoc(docRef);

    if (snap.exists()) {
        const noms = snap.data().noms;
        select.innerHTML = "<option value=''>-- Sélectionnez une catégorie --</option>";

        noms.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            select.appendChild(opt);
        });
    } else {
        select.innerHTML = "<option>Aucune catégorie trouvée</option>";
    }
}

let questions = [];
let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let selectedCategory = "";

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

