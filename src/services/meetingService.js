import { doc, setDoc, updateDoc, serverTimestamp, deleteDoc, collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase/config";
import { generateMeetingId } from "../utils/qrToken";
import { computeMeetingStatus } from "../utils/meetingStatus";
import { getTermForDate, REGULAR_MEETINGS_PER_TERM, MeetingLimitError } from "../utils/meetingTerm";

export { MeetingLimitError };

async function assertUnderTermLimit(meetingDate) {
  const term = getTermForDate(meetingDate);
  const snapshot = await getDocs(collection(db, "meetings"));

  const countInTerm = snapshot.docs.filter((docSnap) => {
    const data = docSnap.data();
    if (data.status === "cancelled") return false;
    return getTermForDate(data.meetingDate).key === term.key;
  }).length;

  if (countInTerm >= REGULAR_MEETINGS_PER_TERM) {
    throw new MeetingLimitError(`You've reached the maximum of ${REGULAR_MEETINGS_PER_TERM} meetings for ${term.label}.`);
  }
}

export const createMeeting = async (meetingData) => {
  try {
    await assertUnderTermLimit(meetingData.meetingDate);

    const id = generateMeetingId();
    const docRef = doc(db, "meetings", id);

    const newMeeting = {
      ...meetingData,
      id,
      createdBy: "Admin",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    newMeeting.status = computeMeetingStatus(newMeeting);

    await setDoc(docRef, newMeeting);

    return newMeeting;
  } catch (error) {
    if (error instanceof MeetingLimitError) throw error;
    console.error("Error creating meeting:", error);
    throw new Error("Failed to create meeting.");
  }
};

export const updateMeeting = async (id, meetingData) => {
  try {
    const docRef = doc(db, "meetings", id);
    const updated = {
      ...meetingData,
      updatedAt: serverTimestamp(),
    };
    updated.status = computeMeetingStatus(updated);

    await updateDoc(docRef, updated);
  } catch (error) {
    console.error("Error updating meeting:", error);
    throw new Error("Failed to update meeting.");
  }
};

export const cancelMeeting = async (id) => {
  try {
    const docRef = doc(db, "meetings", id);
    await updateDoc(docRef, {
      status: "cancelled",
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error cancelling meeting:", error);
    throw new Error("Failed to cancel meeting.");
  }
};

// --- Manual Attendance Service Functions ---

export const getMeetingAttendance = async (meetingId) => {
  try {
    const attendanceRef = collection(db, "meetings", meetingId, "attendance");
    const snapshot = await getDocs(attendanceRef);
    const attendance = {};
    snapshot.forEach((docSnap) => {
      attendance[docSnap.id] = { id: docSnap.id, ...docSnap.data() };
    });
    return attendance;
  } catch (error) {
    console.error("Error fetching meeting attendance:", error);
    return {};
  }
};

export const saveMeetingAttendance = async (meetingId, attendanceList, adminUid = "admin", termId = "Term 13") => {
  try {
    const batch = writeBatch(db);
    attendanceList.forEach((item) => {
      const memberUid = item.memberUid || item.id || item.uid;
      const attRef = doc(db, "meetings", meetingId, "attendance", memberUid);
      const record = {
        memberUid,
        memberName: item.memberName || item.fullName || item.name || "",
        businessName: item.businessName || "",
        phone: item.phone || item.mobileNumber || "",
        status: (item.status || "present").toLowerCase(),
        markedBy: adminUid,
        markedAt: serverTimestamp(),
        termId: item.termId || termId,
      };
      batch.set(attRef, record, { merge: true });
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error saving meeting attendance:", error);
    throw error;
  }
};
