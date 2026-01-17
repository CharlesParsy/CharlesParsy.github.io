import { auth, db } from "../../firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const catId = params.get("cat");
const quizId = params.get("quiz");

let quiz;
let index = 0;
let score = 0;

const title = document.getElementById("title");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next");

const questionBox = document.getElementById("question-box");
const finishBox = document.getElementById("finish-box");
const scoreText = document.getElementById("score-text");
const restartBtn = document.getElementById("restart");

auth.onAuthStateChanged(async (user) => {
    if (!user) {
        alert("Connexion requise");
        return location.href = "../login.html";
    }

    const snap = await getDoc(
        doc(db, "users", user.uid, "categories", catId, "quizzes", quizId)
    );

    if (!snap.exists()) {
        alert("Quiz introuvable");
        return history.back();
    }

    quiz = snap.data();
    title.textContent = quiz.nom;
    showQuestion();
});

function showQuestion() {
    const q = quiz.questions[index];
    questionEl.textContent = q.intitule;
    answersEl.innerHTML = "";
    nextBtn.hidden = true;

    const choices = [...q.answers, q.response].sort(() => Math.random() - 0.5);

    choices.forEach(answer => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = answer;

        btn.onclick = () => {
            [...answersEl.children].forEach(b => b.disabled = true);

            if (answer === q.response) {
                btn.classList.add("correct");
                score++;
            } else {
                btn.classList.add("wrong");
                [...answersEl.children].forEach(b => {
                    if (b.textContent === q.response) {
                        b.classList.add("correct");
                    }
                });
            }

            nextBtn.hidden = false;
        };

        answersEl.appendChild(btn);
    });
}

nextBtn.onclick = () => {
    index++;
    if (index < quiz.questions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
};

function finishQuiz() {
    questionBox.hidden = true;
    finishBox.hidden = false;
    scoreText.textContent = `Score : ${score} / ${quiz.questions.length}`;
}

restartBtn.onclick = () => {
    index = 0;
    score = 0;
    finishBox.hidden = true;
    questionBox.hidden = false;
    showQuestion();
};
