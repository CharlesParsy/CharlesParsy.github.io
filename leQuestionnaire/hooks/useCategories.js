import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCategories = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const snap = await getDocs(
                collection(db, "users", user.uid, "categories")
            );
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setCategories(list);
        } catch (error) {
            console.error("Erreur chargement catégories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return { categories, loading, refresh: loadCategories };
}