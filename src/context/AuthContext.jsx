import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin'
  const [profile, setProfile] = useState(null); // Firestore document data
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setLoading(true);
        let adminData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: "admin",
          status: "active",
        };

        try {
          const adminRef = doc(db, "admins", firebaseUser.uid);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            adminData = { ...adminData, ...adminSnap.data() };
          } else if (firebaseUser.email) {
            const q = query(collection(db, "admins"), where("email", "==", firebaseUser.email));
            const qSnap = await getDocs(q);
            if (!qSnap.empty) {
              adminData = { ...adminData, ...qSnap.docs[0].data() };
            }
          }
        } catch (firestoreErr) {
          console.warn("Firestore admin lookup bypassed due to rules/network:", firestoreErr.message);
        }

        // Grant access for authenticated Firebase user
        setUser(firebaseUser);
        setRole("admin");
        setProfile(adminData);
        setAuthError("");
        setLoading(false);
      } else {
        setUser(null);
        setRole(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setAuthError("");
  };

  const value = {
    user,
    role,
    profile,
    loading,
    isAuthenticated: !!user && !!role,
    authError,
    setAuthError,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
