import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ID de Pierre - REMPLACEZ PAR LE VRAI ID
const PIERRE_UID = "YG6XztpXxZVqWblfEnWZWJdZKq22";

const categoriesDiv = document.getElementById("categories");
const loadingDiv = document.getElementById("loading");
const totalCategoriesEl = document.getElementById("total-categories");
const totalQuizzesEl = document.getElementById("total-quizzes");

let activeCard = null;

// Charger les quiz au démarrage
loadPublicQuizzes();

async function loadPublicQuizzes() {
    try {
        categoriesDiv.innerHTML = "";
        loadingDiv.style.display = "block";

        const catSnap = await getDocs(collection(db, "users", PIERRE_UID, "categories"));

        if (catSnap.empty) {
            showEmptyState();
            return;
        }

        loadingDiv.style.display = "none";

        let totalQuizzes = 0;

        for (let cat of catSnap.docs) {
            const catData = cat.data();
            const catDiv = document.createElement("div");
            catDiv.className = "category-card";

            catDiv.innerHTML = `
                <div class="category-header">
                    <h3>${catData.name}</h3>
                </div>
                <div class="quiz-list" id="quizzes-${cat.id}"></div>
            `;

            categoriesDiv.appendChild(catDiv);

            const quizzesDiv = document.getElementById(`quizzes-${cat.id}`);
            const quizSnap = await getDocs(collection(db, "users", PIERRE_UID, "categories", cat.id, "quizzes"));

            if (quizSnap.empty) {
                quizzesDiv.innerHTML = '<p class="empty">Aucun quiz dans cette catégorie</p>';
                continue;
            }

            totalQuizzes += quizSnap.size;

            for (let q of quizSnap.docs) {
                const quiz = q.data();
                const qDiv = document.createElement("div");
                qDiv.className = "quiz-card";
                qDiv.dataset.catId = cat.id;
                qDiv.dataset.quizId = q.id;

                qDiv.innerHTML = `
                    <h4>${quiz.nom}</h4>
                    <p>${quiz.description || "Pas de description"}</p>

                    <div class="quiz-hover-actions">
                        <button class="btn-primary play-btn">🎮 Jouer maintenant</button>
                        <div class="quiz-info">
                            ${quiz.questions ? quiz.questions.length : 0} questions
                        </div>
                    </div>
                `;

                // Gestion du clic/tap sur la carte
                qDiv.addEventListener('click', (e) => {
                    // Si on clique sur le bouton, on ne fait rien ici
                    if (e.target.closest('.play-btn')) {
                        return;
                    }

                    // Toggle l'état actif
                    if (activeCard === qDiv) {
                        qDiv.classList.remove('active');
                        activeCard = null;
                    } else {
                        if (activeCard) {
                            activeCard.classList.remove('active');
                        }
                        qDiv.classList.add('active');
                        activeCard = qDiv;
                    }
                });

                // Bouton play
                const playBtn = qDiv.querySelector('.play-btn');
                playBtn.onclick = (e) => {
                    e.stopPropagation();
                    window.location.href = `play/?cat=${cat.id}&quiz=${q.id}`;
                };

                quizzesDiv.appendChild(qDiv);
            }
        }

        // Mettre à jour les statistiques
        totalCategoriesEl.textContent = catSnap.size;
        totalQuizzesEl.textContent = totalQuizzes;

    } catch (error) {
        console.error("Erreur lors du chargement des quiz:", error);
        loadingDiv.innerHTML = `
            <div class="empty-state">
                <h3>❌ Erreur de chargement</h3>
                <p>Impossible de charger les quiz. Veuillez réessayer plus tard.</p>
            </div>
        `;
    }
}

function showEmptyState() {
    loadingDiv.style.display = "none";
    categoriesDiv.innerHTML = `
        <div class="empty-state">
            <h3>📭 Aucun quiz disponible</h3>
            <p>Les quiz seront bientôt disponibles !</p>
        </div>
    `;
}

// Fermer la carte active si on clique ailleurs
document.addEventListener('click', (e) => {
    if (activeCard && !e.target.closest('.quiz-card')) {
        activeCard.classList.remove('active');
        activeCard = null;
    }
});