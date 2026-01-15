import { useState } from "react";

export function useQuizForm(initialData = null) {
    const [nom, setNom] = useState(initialData?.nom || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [questions, setQuestions] = useState(initialData?.questions || [{
        intitule: "",
        answers: [""],
        response: "",
        explanation: ""
    }]);

    const addQuestion = () => {
        setQuestions([...questions, {
            intitule: "",
            answers: [""],
            response: "",
            explanation: ""
        }]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, field, value) => {
        const copy = [...questions];
        copy[index][field] = value;
        setQuestions(copy);
    };

    const addAnswer = (qIndex) => {
        const copy = [...questions];
        if (copy[qIndex].answers.length >= 5) return;
        copy[qIndex].answers.push("");
        setQuestions(copy);
    };

    const updateAnswer = (qIndex, aIndex, value) => {
        const copy = [...questions];
        copy[qIndex].answers[aIndex] = value;
        setQuestions(copy);
    };

    const removeAnswer = (qIndex, aIndex) => {
        const copy = [...questions];
        copy[qIndex].answers.splice(aIndex, 1);
        setQuestions(copy);
    };

    return {
        nom, setNom,
        description, setDescription,
        questions, setQuestions,
        addQuestion,
        removeQuestion,
        updateQuestion,
        addAnswer,
        updateAnswer,
        removeAnswer
    };
}