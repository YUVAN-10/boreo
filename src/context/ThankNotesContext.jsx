import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { createThankNote } from "../services/thankNoteService";

const INITIAL_DUMMY_NOTES = [
  {
    id: "boreo-tn-1",
    fromMemberId: "boreo-mem-1",
    fromMemberName: "Rajesh Sharma",
    fromName: "Rajesh Sharma",
    toMemberId: "boreo-mem-2",
    toMemberName: "Anitha V",
    toName: "Anitha V",
    value: 150000,
    comments: "Thank you for the tech project referral!",
    createdAt: new Date(),
  },
  {
    id: "boreo-tn-2",
    fromMemberId: "boreo-mem-2",
    fromMemberName: "Anitha V",
    fromName: "Anitha V",
    toMemberId: "boreo-mem-1",
    toMemberName: "Rajesh Sharma",
    toName: "Rajesh Sharma",
    value: 75000,
    comments: "Thank you for the trading software contract!",
    createdAt: new Date(),
  },
];

const ThankNotesContext = createContext(null);

export function ThankNotesProvider({ children }) {
  const [thankNotes, setThankNotes] = useState(INITIAL_DUMMY_NOTES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "thankNotes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesData = [];
        snapshot.forEach((docSnap) => {
          notesData.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (notesData.length > 0) {
          setThankNotes(notesData);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching thank notes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      thankNotes,
      loading,
      addThankNote: async (data) => {
        return await createThankNote(data);
      },
    }),
    [thankNotes, loading]
  );

  return <ThankNotesContext.Provider value={value}>{children}</ThankNotesContext.Provider>;
}

export function useThankNotes() {
  const ctx = useContext(ThankNotesContext);
  if (!ctx) {
    throw new Error("useThankNotes must be used within a ThankNotesProvider");
  }
  return ctx;
}
