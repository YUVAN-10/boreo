import { ref, uploadBytes, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase/config";

// Uploads a File object or base64 Data URL to Firebase Storage
export const uploadFile = async (fileOrDataUrl, path) => {
  if (!fileOrDataUrl) return null;
  if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("http")) {
    return fileOrDataUrl;
  }

  const storageRef = ref(storage, path || `uploads/${Date.now()}`);
  try {
    let snapshot;
    if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")) {
      snapshot = await uploadString(storageRef, fileOrDataUrl, "data_url");
    } else if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      snapshot = await uploadBytes(storageRef, fileOrDataUrl);
    } else {
      return fileOrDataUrl;
    }
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.warn("Firebase Storage upload warning (fallback enabled):", error.message || error);
    // Fall back to returning dataUrl string so doc creation/saving is not blocked
    if (typeof fileOrDataUrl === "string") return fileOrDataUrl;
    return null;
  }
};

export const uploadImage = async (path, dataUrl) => {
  return uploadFile(dataUrl, path);
};

export const deleteImage = async (path) => {
  if (!path) return;
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn("Firebase Storage delete warning:", error.message || error);
  }
};
