import { db } from "./firebase.js";
import { requireAuth } from "./auth.js";
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("categories");
const addBtn = document.getElementById("addCategory");

requireAuth(async (user) => {
    loadCategories(user.uid);

    addBtn.onclick = async () => {
        const name = prompt("Nom de la catégorie");
        if (!name) return;
        await addDoc(collection(db, "users", user.uid, "categories"), { name });
        loadCategories(user.uid);
    };
});

async function loadCategories(uid) {
    container.innerHTML = "";
    const snap = await getDocs(collection(db, "users", uid, "categories"));

    for (const cat of snap.docs) {
        const div = document.createElement("div");
        div.innerHTML = `
      <h2>${cat.data().name}</h2>
      <button data-id="${cat.id}">Supprimer</button>
      <div class="quizzes"></div>
    `;
        container.appendChild(div);

        div.querySelector("button").onclick = async () => {
            await deleteDoc(doc(db, "users", uid, "categories", cat.id));
            loadCategories(uid);
        };

        loadQuizzes(uid, cat.id, div.querySelector(".quizzes"));
    }
}

async function loadQuizzes(uid, catId, target) {
    const snap = await getDocs(
        collection(db, "users", uid, "categories", catId, "quizzes")
    );

    snap.forEach(q => {
        const el = document.createElement("div");
        el.textContent = q.data().nom;
        el.onclick = () => {
            window.location.href = `play.html?cat=${catId}&quiz=${q.id}`;
        };
        target.appendChild(el);
    });
}
