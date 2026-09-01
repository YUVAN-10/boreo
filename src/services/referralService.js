import {
  doc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export class ReferralError extends Error {}

function selfReferralId(referrerId, referredUserId) {
  return `self_${referrerId}_${referredUserId}`;
}

function connectReferralId(referrerId, connectorId, referredUserId) {
  return `connect_${referrerId}_${connectorId}_${referredUserId}`;
}

async function assertActiveMember(uid, label) {
  if (!uid) throw new ReferralError(`${label} is required.`);
  const snap = await getDoc(doc(db, "members", uid));
  if (!snap.exists()) {
    throw new ReferralError(`${label} could not be found. Please select a valid member.`);
  }
  return snap.data();
}

export async function checkDuplicateReferral({ type, referrerId, connectorId, referredUserId }) {
  if (!referrerId || !referredUserId) return false;
  if (type === "connect" && !connectorId) return false;

  const id =
    type === "self"
      ? selfReferralId(referrerId, referredUserId)
      : connectReferralId(referrerId, connectorId, referredUserId);

  const snap = await getDoc(doc(db, "referrals", id));
  return snap.exists() && snap.data()?.status === "active";
}

export async function createSelfReferral({ referrerId, referrerName, referredUserId, referredUserName }) {
  if (!referrerId || !referredUserId) {
    throw new ReferralError("Please select both a referrer and a referred member.");
  }
  if (referrerId === referredUserId) {
    throw new ReferralError("A member cannot refer themselves.");
  }

  await assertActiveMember(referrerId, "Referrer");
  await assertActiveMember(referredUserId, "Referred member");

  const id = selfReferralId(referrerId, referredUserId);
  const ref = doc(db, "referrals", id);

  await runTransaction(db, async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists() && existing.data()?.status === "active") {
      throw new ReferralError("This referral already exists.");
    }

    tx.set(ref, {
      type: "self",
      referrerId,
      referrerName,
      connectorId: null,
      connectorName: null,
      referredUserId,
      referredUserName,
      createdAt: serverTimestamp(),
      createdBy: referrerId,
      createdByName: referrerName,
      status: "active",
    });
  });

  return id;
}

export async function createConnectReferral({
  referrerId,
  referrerName,
  connectorId,
  connectorName,
  referredUserId,
  referredUserName,
}) {
  if (!referrerId || !connectorId || !referredUserId) {
    throw new ReferralError("Please select the original referrer, connector, and referred member.");
  }

  const uniqueIds = new Set([referrerId, connectorId, referredUserId]);
  if (uniqueIds.size < 3) {
    throw new ReferralError("Referrer, connector, and referred member must all be different people.");
  }

  await assertActiveMember(referrerId, "Original referrer");
  await assertActiveMember(connectorId, "Connector");
  await assertActiveMember(referredUserId, "Referred member");

  const id = connectReferralId(referrerId, connectorId, referredUserId);
  const ref = doc(db, "referrals", id);

  await runTransaction(db, async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists() && existing.data()?.status === "active") {
      throw new ReferralError("This referral already exists.");
    }

    tx.set(ref, {
      type: "connect",
      referrerId,
      referrerName,
      connectorId,
      connectorName,
      referredUserId,
      referredUserName,
      createdAt: serverTimestamp(),
      createdBy: referrerId,
      createdByName: referrerName,
      status: "active",
    });
  });

  return id;
}

export async function getReferrals() {
  const querySnapshot = await getDocs(collection(db, "referrals"));
  const referrals = [];
  querySnapshot.forEach((doc) => {
    referrals.push({ id: doc.id, ...doc.data() });
  });
  return referrals;
}

export async function getReferral(id) {
  const snap = await getDoc(doc(db, "referrals", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export function subscribeToReferrals(onChange, onError) {
  const referralsRef = collection(db, "referrals");

  return onSnapshot(
    referralsRef,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }));

      items.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      onChange(items);
    },
    (error) => {
      console.error("Error fetching referrals:", error);
      onError?.(error);
    }
  );
}

export function friendlyReferralError(error) {
  if (error instanceof ReferralError) return error.message;
  if (error?.code === "permission-denied") return "You don't have permission to do this.";
  if (error?.code === "unavailable") return "Network error. Please check your connection and try again.";
  return "Something went wrong. Please try again.";
}
