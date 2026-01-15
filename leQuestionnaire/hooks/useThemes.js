import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export function useThemes() {
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadThemes = async () => {
            try {
                const snap = await getDocs(collection(db, "themes"));
                const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setThemes(list);
            } catch (error) {
                console.error("Erreur chargement thèmes:", error);
            } finally {
                setLoading(false);
            }
        };
        loadThemes();
    }, []);

    return { themes, loading };
}