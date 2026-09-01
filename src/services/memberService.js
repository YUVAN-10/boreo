import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadImage } from "./storageService";

export const normalizePhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

export const createMember = async (memberData, profileImageFile) => {
  try {
    const uid = `mem-${Date.now()}`;
    let profileImageUrl = null;

    if (profileImageFile) {
      profileImageUrl = await uploadImage(`memberProfiles/${uid}/profile.jpg`, profileImageFile);
    }

    const docRef = doc(db, "members", uid);
    const normalizedPhone = normalizePhone(memberData.phone);
    const businessAddress = memberData.businessAddres || memberData.businessAddress || "";
    const experience = memberData.experience || memberData.experienceYears || 0;
    const flyer = memberData.businessFlyer || memberData.flyer || "";

    const payload = {
      ...memberData,
      uid,
      phone: normalizedPhone,
      profileImage: profileImageUrl || memberData.profileImage || "",
      businessAddres: businessAddress,
      businessAddress: businessAddress,
      experience: experience,
      experienceYears: experience,
      businessFlyer: flyer,
      flyer: flyer,
      status: memberData.status || "Active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload);
    return uid;
  } catch (error) {
    console.error("Error creating member:", error);
    if (error?.code === "permission-denied") {
      throw new Error("Firestore Permission Denied: Please allow read/write access in Firebase Console Rules for boreo-79678.");
    }
    throw new Error(error.message || "Failed to create member.");
  }
};

export const updateMember = async (uid, memberData, profileImageFile) => {
  try {
    const docRef = doc(db, "members", uid);
    let profileImageUrl = memberData.profileImage;

    if (profileImageFile) {
      profileImageUrl = await uploadImage(`memberProfiles/${uid}/profile.jpg`, profileImageFile);
    }

    const businessAddress = memberData.businessAddres || memberData.businessAddress || "";
    const experience = memberData.experience || memberData.experienceYears || 0;
    const flyer = memberData.businessFlyer || memberData.flyer || "";

    const updateData = {
      ...memberData,
      profileImage: profileImageUrl || "",
      businessAddres: businessAddress,
      businessAddress: businessAddress,
      experience: experience,
      experienceYears: experience,
      businessFlyer: flyer,
      flyer: flyer,
      updatedAt: serverTimestamp(),
    };

    if (memberData.phone) {
      updateData.phone = normalizePhone(memberData.phone);
    }

    await setDoc(docRef, updateData, { merge: true });
  } catch (error) {
    console.error("Error updating member:", error);
    if (error?.code === "permission-denied") {
      throw new Error("Firestore Permission Denied: Please allow read/write access in Firebase Console Rules for boreo-79678.");
    }
    throw new Error(error.message || "Failed to update member.");
  }
};

export const updateMemberStatus = async (uid, status) => {
  try {
    const docRef = doc(db, "members", uid);
    await setDoc(docRef, { status, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("Error updating member status:", error);
    if (error?.code === "permission-denied") {
      throw new Error("Firestore Permission Denied: Please allow read/write access in Firebase Console Rules for boreo-79678.");
    }
    throw new Error(error.message || "Failed to update member status.");
  }
};
