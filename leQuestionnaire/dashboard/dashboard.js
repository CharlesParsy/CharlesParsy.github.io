import { db, auth } from "../firebase.js";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const categoriesDiv = document.getElementById("categories");
const logoutBtn = document.getElementById("logout-btn");
const createCatBtn = document.getElementById("create-category-btn");

let userUid;

onAuthStateChanged(auth, async (user) => {
    if (!user) return window.location.href = "../login";
    userUid = user.uid;
    loadCategories();
});

logoutBtn.onclick = async () => {
    try {
        await signOut(auth);
        window.location.href = "../login";
    } catch (e) {
        alert("Erreur lors de la déconnexion");
        console.error(e);
    }
};

// Créer une catégorie
createCatBtn.onclick = async () => {
    const name = prompt("Nom de la nouvelle catégorie :");
    if (!name) return;
    await addDoc(collection(db, "users", userUid, "categories"), { name });
    loadCategories();
};

// Charger catégories + quiz
async function loadCategories() {
    categoriesDiv.innerHTML = "";
    const catSnap = await getDocs(collection(db, "users", userUid, "categories"));
    for (let cat of catSnap.docs) {
        const catData = cat.data();
        const catDiv = document.createElement("div");
        catDiv.className = "category-card";

        catDiv.innerHTML = `
    <div class="category-header">
        <h3>${catData.name}</h3>
        <div class="category-actions">
            <button class="btn-primary" onclick="renameCategory('${cat.id}', '${catData.name}')">✏️</button>
            <button class="btn-primary red-btn" onclick="deleteCategory('${cat.id}')">🗑️</button>
        </div>
    </div>
    <div class="quiz-list" id="quizzes-${cat.id}"></div>
`;

        categoriesDiv.appendChild(catDiv);


        const quizzesDiv = document.getElementById(`quizzes-${cat.id}`);
        const quizSnap = await getDocs(collection(cat.ref, "quizzes"));
        for (let q of quizSnap.docs) {
            const quiz = q.data();
            const qDiv = document.createElement("div");
            qDiv.className = "quiz-card";
            qDiv.innerHTML = `
    <h4>${quiz.nom}</h4>
    <p>${quiz.description || ""}</p>

    <div class="quiz-hover-actions">
        <button class="btn-primary" onclick="window.location.href='play/?cat=${cat.id}&quiz=${q.id}'">Jouer</button>
        <button class="btn-primary" onclick="window.location.href='edit/?cat=${cat.id}&quiz=${q.id}'">Modifier</button>
        <button class="btn-primary red-btn" onclick="deleteQuiz('${cat.id}', '${q.id}')">Supprimer</button>
    </div>
`;
            quizzesDiv.appendChild(qDiv);
        }

        // Ajouter un bouton créer quiz
        const addQuizBtn = document.createElement("button");
        addQuizBtn.className = "btn-primary";
        addQuizBtn.textContent = "+ Quiz";
        addQuizBtn.onclick = () => {
            window.location.href = `create/?cat=${cat.id}`;
        };
        quizzesDiv.appendChild(addQuizBtn);
    }
}

// Supprimer un quiz
window.deleteQuiz = async (catId, quizId) => {
    if (!confirm("Supprimer ce quiz ?")) return;
    await deleteDoc(doc(db, "users", userUid, "categories", catId, "quizzes", quizId));
    loadCategories();
};

window.renameCategory = async (catId, oldName) => {
    const name = prompt("Nouveau nom de la catégorie :", oldName);
    if (!name) return;

    await updateDoc(doc(db, "users", userUid, "categories", catId), { name });
    loadCategories();
};

window.deleteCategory = async (catId) => {
    if (!confirm("Supprimer cette catégorie et tous ses quiz ?")) return;

    await deleteDoc(doc(db, "users", userUid, "categories", catId));
    loadCategories();
};

