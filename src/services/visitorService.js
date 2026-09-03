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
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import { createMember } from "./memberService";

const COLLECTION_NAME = "visitors";

export const getVisitors = async (termId = null) => {
  try {
    let q;
    if (termId) {
      q = query(collection(db, COLLECTION_NAME), where("termId", "==", termId));
    } else {
      q = query(collection(db, COLLECTION_NAME));
    }
    const querySnapshot = await getDocs(q);
    const visitors = [];
    querySnapshot.forEach((docSnap) => {
      visitors.push({ id: docSnap.id, ...docSnap.data() });
    });
    return visitors;
  } catch (error) {
    console.error("Error fetching visitors:", error);
    throw error;
  }
};

export const getVisitor = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error("Error fetching visitor by ID:", error);
    return null;
  }
};

export const createVisitor = async (visitorData) => {
  try {
    const docRef = doc(collection(db, COLLECTION_NAME));
    const payload = {
      visitorName: visitorData.visitorName || "",
      inviteById: visitorData.inviteById || "",
      inviteByName: visitorData.inviteByName || visitorData.inviteBy || "",
      phone: visitorData.phone || "",
      email: visitorData.email || "",
      companyName: visitorData.companyName || visitorData.businessName || "",
      category: visitorData.category || "",
      status: visitorData.status || "Pending",
      visitDate: visitorData.visitDate || new Date().toISOString().split("T")[0],
      termId: visitorData.termId || "Term 13",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload);
    return docRef.id;
  } catch (error) {
    console.error("Error creating visitor:", error);
    throw error;
  }
};

export const updateVisitor = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    delete payload.points;
    await updateDoc(docRef, payload);
    return id;
  } catch (error) {
    console.error("Error updating visitor:", error);
    throw error;
  }
};

export const convertVisitorToMember = async (visitor) => {
  try {
    // 1. Create a new member from visitor details
    const memberData = {
      fullName: visitor.visitorName,
      businessName: visitor.companyName || "",
      phone: visitor.phone || "",
      email: visitor.email || "",
      category: visitor.category || "",
      status: "Active",
      rid: `ORG${Math.floor(10000 + Math.random() * 90000)}`,
      termId: visitor.termId || "Term 13",
    };
    const memberId = await createMember(memberData);

    // 2. Update visitor status to Joined
    await updateVisitor(visitor.id, {
      status: "Joined",
      convertedMemberId: memberId,
    });

    return memberId;
  } catch (error) {
    console.error("Error converting visitor to member:", error);
    throw error;
  }
};

export const deleteVisitor = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting visitor:", error);
    throw error;
  }
};
