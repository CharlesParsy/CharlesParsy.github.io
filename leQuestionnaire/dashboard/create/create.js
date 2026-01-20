import { db, auth } from "../../firebase.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const catFromUrl = params.get("cat");

const quizName = document.getElementById("quiz-name");
const quizDesc = document.getElementById("quiz-desc");
const categorySelect = document.getElementById("category-select");
const themesDiv = document.getElementById("themes");
const questionsDiv = document.getElementById("questions");
const addQuestionBtn = document.getElementById("add-question");
const createBtn = document.getElementById("create-quiz");
const cancelBtn = document.getElementById("cancel-btn");

let userUid;
let selectedTheme = "";
let questions = [];

/* =====================AUTH===================== */
onAuthStateChanged(auth, async (user) => {
    if (!user) return location.href = "../../login";
    userUid = user.uid;

    await loadCategories();
    await loadThemes();

    // Ajouter une question par défaut
    questions.push(createEmptyQuestion());
    renderQuestions();
});

/* =====================CATEGORIES===================== */
async function loadCategories() {
    const snap = await getDocs(collection(db, "users", userUid, "categories"));
    categorySelect.innerHTML = "";

    if (snap.empty) {
        alert("Vous devez créer au moins une catégorie");
        return location.href = "..";
    }

    snap.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.data().name;

        if (c.id === catFromUrl) opt.selected = true;

        categorySelect.appendChild(opt);
    });
}

/* =====================THEMES===================== */
async function loadThemes() {
    const snap = await getDocs(collection(db, "themes"));
    themesDiv.innerHTML = "";

    if (snap.empty) {
        themesDiv.innerHTML = "<p>Aucun thème disponible</p>";
        return;
    }

    let first = true;

    snap.forEach(t => {
        const themeData = t.data();
        const div = document.createElement("div");
        div.className = "theme-card";
        div.dataset.themeId = t.id;
        div.textContent = themeData.name;
        div.style.background = themeData.color || "#ddd";

        if (first) {
            div.classList.add("selected");
            selectedTheme = t.id;
            first = false;
        }

        div.onclick = () => {
            document.querySelectorAll(".theme-card").forEach(e => e.classList.remove("selected"));
            div.classList.add("selected");
            selectedTheme = t.id;
        };

        themesDiv.appendChild(div);
    });
}

/* =====================QUESTIONS===================== */
function createEmptyQuestion() {
    return {
        intitule: "",
        response: "",
        answers: [""]
    };
}

function renderQuestions() {
    questionsDiv.innerHTML = "";

    if (questions.length === 0) {
        questionsDiv.innerHTML = "<p class='empty'>Aucune question. Cliquez sur '+ Ajouter une question'</p>";
        return;
    }

    questions.forEach((q, qi) => {
        const box = document.createElement("div");
        box.className = "question-box-create";

        box.innerHTML = `
            <div class="question-header">
                <h4>Question ${qi + 1}</h4>
                <button class="btn-icon red-btn" title="Supprimer la question">🗑️</button>
            </div>
            <label>Intitulé de la question</label>
            <input class="question-input" placeholder="Ex: Quelle est la capitale de la France ?" value="${q.intitule}">
            
            <label>Bonne réponse</label>
            <input class="correct-input" placeholder="Ex: Paris" value="${q.response}">
            
            <label>Réponses fausses</label>
            <div class="wrong-answers"></div>
            <button class="btn-secondary add-wrong">+ Ajouter une réponse fausse</button>
        `;

        const questionInput = box.querySelector(".question-input");
        const correctInput = box.querySelector(".correct-input");
        const wrongDiv = box.querySelector(".wrong-answers");
        const addWrongBtn = box.querySelector(".add-wrong");
        const deleteBtn = box.querySelector(".red-btn");

        questionInput.oninput = e => {
            q.intitule = e.target.value;
        };

        correctInput.oninput = e => {
            q.response = e.target.value;
        };

        // Afficher les réponses fausses existantes
        q.answers.forEach((a, ai) => {
            addWrongAnswerInput(wrongDiv, q, ai);
        });

        addWrongBtn.onclick = () => {
            if (q.answers.length >= 5) return alert("Maximum 5 réponses fausses");
            q.answers.push("");
            renderQuestions();
        };

        deleteBtn.onclick = () => {
            if (questions.length === 1) {
                return alert("Vous devez avoir au moins une question");
            }
            if (confirm("Supprimer cette question ?")) {
                questions.splice(qi, 1);
                renderQuestions();
            }
        };
        questionsDiv.appendChild(box);
    });
}

function addWrongAnswerInput(container, question, index) {
    const div = document.createElement("div");
    div.className = "wrong-answer-row";

    const input = document.createElement("input");
    input.placeholder = `Réponse fausse ${index + 1}`;
    input.value = question.answers[index];
    input.oninput = e => {
        question.answers[index] = e.target.value;
    };

    const btn = document.createElement("button");
    btn.textContent = "✖";
    btn.className = "btn-icon red-btn";
    btn.title = "Supprimer cette réponse";
    btn.onclick = () => {
        if (question.answers.length <= 1) {
            return alert("Vous devez avoir au moins 1 réponses fausses");
        }
        question.answers.splice(index, 1);
        renderQuestions();
    };

    div.appendChild(input);
    div.appendChild(btn);
    container.appendChild(div);
}



addQuestionBtn.onclick = () => {
    questions.push(createEmptyQuestion());
    renderQuestions();
    // Scroll vers la nouvelle question
    setTimeout(() => {
        questionsDiv.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
};

/* =====================VALIDATION===================== */
function validateQuiz() {
    const errors = [];

    if (!quizName.value.trim()) {
        errors.push("Le nom du quiz est requis");
    }

    if (!categorySelect.value) {
        errors.push("La catégorie est requise");
    }

    if (!selectedTheme) {
        errors.push("Le thème est requis");
    }

    if (questions.length === 0) {
        errors.push("Vous devez avoir au moins une question");
    }

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const num = i + 1;

        if (!q.intitule.trim()) {
            errors.push(`Question ${num}: L'intitulé est requis`);
        }

        if (!q.response.trim()) {
            errors.push(`Question ${num}: La bonne réponse est requise`);
        }
        //
        // const validWrongAnswers = q.answers.filter(a => a.trim());
        // if (validWrongAnswers.length < 2) {
        //     errors.push(`Question ${num}: Au moins 2 réponses fausses sont requises`);
        // }
    }

    return errors;
}

/* =====================CREATE QUIZ===================== */
createBtn.onclick = async () => {
    const errors = validateQuiz();

    if (errors.length > 0) {
        alert("Erreurs de validation :\n\n" + errors.join("\n"));
        return;
    }

    // Nettoyer les réponses fausses vides
    const cleanedQuestions = questions.map(q => ({
        ...q,
        answers: q.answers.filter(a => a.trim())
    }));

    const quizData = {
        nom: quizName.value.trim(),
        description: quizDesc.value.trim(),
        themeId: selectedTheme,
        questions: cleanedQuestions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    try {
        createBtn.disabled = true;
        createBtn.textContent = "Création...";

        await addDoc(
            collection(db, "users", userUid, "categories", categorySelect.value, "quizzes"),
            quizData
        );

        alert("Quiz créé avec succès !");
        location.href = "..";
    } catch (e) {
        console.error(e);
        alert("Erreur lors de la création : " + e.message);
        createBtn.disabled = false;
        createBtn.textContent = "✅ Créer le quiz";
    }
};

/* =====================CANCEL===================== */
cancelBtn.onclick = () => {
    if (confirm("Annuler ? Toutes les modifications seront perdues.")) {
        location.href = "..";
    }
};
