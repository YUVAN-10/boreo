import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION_NAME = "oneToOne";

export const getOneToOnes = async (termId = null) => {
  try {
    let q;
    if (termId) {
      q = query(collection(db, COLLECTION_NAME), where("termId", "==", termId));
    } else {
      q = query(collection(db, COLLECTION_NAME));
    }
    const querySnapshot = await getDocs(q);
    const records = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });
    return records;
  } catch (error) {
    console.warn("Firestore One to One query fallback:", error.message);
    if (error?.code === "permission-denied") {
      return [];
    }
    throw error;
  }
};

export const getOneToOneById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.warn("Error fetching One to One by ID:", error.message);
    return null;
  }
};

export const createOneToOne = async (data) => {
  try {
    const docRef = doc(collection(db, COLLECTION_NAME));
    const payload = {
      fromMemberId: data.fromMemberId || "",
      fromMemberName: data.fromMemberName || "",
      toMemberId: data.toMemberId || "",
      toMemberName: data.toMemberName || "",
      meetingLocation: data.meetingLocation || "From Member Office",
      meetingOfficeName: data.meetingOfficeName || data.meetingLocation || "From Member Office",
      date: data.date || new Date().toISOString().split("T")[0],
      time: data.time || "10:00 AM",
      status: data.status || "Completed",
      termId: data.termId || "Term 13",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload);
    return docRef.id;
  } catch (error) {
    console.error("Error creating One to One record:", error);
    if (error?.code === "permission-denied") {
      throw new Error("Firestore Permission Denied: Update Firestore Rules in Firebase Console for boreo-79678.");
    }
    throw error;
  }
};

export const updateOneToOne = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    delete payload.points;
    delete payload.fromMemberPoints;
    delete payload.toMemberPoints;

    await updateDoc(docRef, payload);
    return id;
  } catch (error) {
    console.error("Error updating One to One record:", error);
    if (error?.code === "permission-denied") {
      throw new Error("Firestore Permission Denied: Update Firestore Rules in Firebase Console for boreo-79678.");
    }
    throw error;
  }
};

export const deleteOneToOne = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting One to One record:", error);
    if (error?.code === "permission-denied") {
      throw new Error("Firestore Permission Denied: Update Firestore Rules in Firebase Console for boreo-79678.");
    }
    throw error;
  }
};
