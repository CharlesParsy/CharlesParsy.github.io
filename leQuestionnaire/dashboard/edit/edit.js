import { db, auth } from "../../firebase.js";
import { collection, getDocs, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const catId = params.get("cat");
const quizId = params.get("quiz");

const quizName = document.getElementById("quiz-name");
const quizDesc = document.getElementById("quiz-desc");
const categorySelect = document.getElementById("category-select");
const themesDiv = document.getElementById("themes");
const questionsDiv = document.getElementById("questions");
const addQuestionBtn = document.getElementById("add-question");
const updateBtn = document.getElementById("update-quiz");
const cancelBtn = document.getElementById("cancel-btn");

let userUid;
let selectedTheme = "";
let questions = [];
let originalData = null;

/* =====================AUTH & LOAD===================== */
onAuthStateChanged(auth, async (user) => {
    if (!user) return location.href = "../../login";
    userUid = user.uid;

    if (!catId || !quizId) {
        alert("Quiz non spécifié");
        return location.href = "..";
    }

    await loadCategories();
    await loadThemes();
    await loadQuiz();
});

/* =====================LOAD QUIZ===================== */
async function loadQuiz() {
    try {
        const snap = await getDoc(
            doc(db, "users", userUid, "categories", catId, "quizzes", quizId)
        );

        if (!snap.exists()) {
            alert("Quiz introuvable");
            return location.href = "..";
        }

        const quizData = snap.data();

        // Sauvegarder les données originales
        originalData = JSON.parse(JSON.stringify(quizData));

        // Remplir les champs
        quizName.value = quizData.nom || "";
        quizDesc.value = quizData.description || "";
        selectedTheme = quizData.themeId || "";
        questions = quizData.questions || [createEmptyQuestion()];

        // Sélectionner la catégorie
        categorySelect.value = catId;

        // Sélectionner le thème
        document.querySelectorAll(".theme-card").forEach(card => {
            if (card.dataset.themeId === selectedTheme) {
                card.classList.add("selected");
            }
        });

        renderQuestions();
    } catch (e) {
        console.error(e);
        alert("Erreur lors du chargement du quiz");
        location.href = "..";
    }
}

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

    snap.forEach(t => {
        const themeData = t.data();
        const div = document.createElement("div");
        div.className = "theme-card";
        div.dataset.themeId = t.id;
        div.textContent = themeData.name;
        div.style.background = themeData.color || "#ddd";

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
            updateQuestionCounter();
        };

        correctInput.oninput = e => {
            q.response = e.target.value;
            updateQuestionCounter();
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

    updateQuestionCounter();
}

function addWrongAnswerInput(container, question, index) {
    const div = document.createElement("div");
    div.className = "wrong-answer-row";

    const input = document.createElement("input");
    input.placeholder = `Réponse fausse ${index + 1}`;
    input.value = question.answers[index];
    input.oninput = e => {
        question.answers[index] = e.target.value;
        updateQuestionCounter();
    };

    const btn = document.createElement("button");
    btn.textContent = "✖";
    btn.className = "btn-icon red-btn";
    btn.title = "Supprimer cette réponse";
    // btn.onclick = () => {
    //     if (question.answers.length <= 2) {
    //         return alert("Vous devez avoir au moins 2 réponses fausses");
    //     }
    //     question.answers.splice(index, 1);
    //     renderQuestions();
    // };

    div.appendChild(input);
    div.appendChild(btn);
    container.appendChild(div);
}

function updateQuestionCounter() {
    const counter = document.getElementById("question-counter");
    if (counter) {
        const valid = questions.filter(q =>
            q.intitule.trim() &&
            q.response.trim() &&
            q.answers.filter(a => a.trim()).length >= 2
        ).length;
        counter.textContent = `${valid} / ${questions.length} questions valides`;
    }
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

        // const validWrongAnswers = q.answers.filter(a => a.trim());
        // if (validWrongAnswers.length < 2) {
        //     errors.push(`Question ${num}: Au moins 2 réponses fausses sont requises`);
        // }
    }

    return errors;
}

/* =====================CHECK CHANGES===================== */
function hasChanges() {
    if (!originalData) return false;

    const currentData = {
        nom: quizName.value.trim(),
        description: quizDesc.value.trim(),
        themeId: selectedTheme,
        questions: questions.map(q => ({
            ...q,
            answers: q.answers.filter(a => a.trim())
        }))
    };

    return JSON.stringify(currentData) !== JSON.stringify({
        nom: originalData.nom,
        description: originalData.description,
        themeId: originalData.themeId,
        questions: originalData.questions
    });
}

/* =====================UPDATE QUIZ===================== */
updateBtn.onclick = async () => {
    const errors = validateQuiz();

    if (errors.length > 0) {
        alert("Erreurs de validation :\n\n" + errors.join("\n"));
        return;
    }

    if (!hasChanges()) {
        if (confirm("Aucune modification détectée. Retourner au dashboard ?")) {
            location.href = "..";
        }
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
        updatedAt: new Date().toISOString()
    };

    // Conserver la date de création si elle existe
    if (originalData.createdAt) {
        quizData.createdAt = originalData.createdAt;
    }

    try {
        updateBtn.disabled = true;
        updateBtn.textContent = "Mise à jour...";

        await updateDoc(
            doc(db, "users", userUid, "categories", catId, "quizzes", quizId),
            quizData
        );

        alert("Quiz mis à jour avec succès !");
        location.href = "..";
    } catch (e) {
        console.error(e);
        alert("Erreur lors de la mise à jour : " + e.message);
        updateBtn.disabled = false;
        updateBtn.textContent = "💾 Mettre à jour le quiz";
    }
};

/* =====================CANCEL===================== */
cancelBtn.onclick = () => {
    if (hasChanges()) {
        if (confirm("Des modifications non enregistrées seront perdues. Continuer ?")) {
            location.href = "..";
        }
    } else {
        location.href = "..";
    }
};