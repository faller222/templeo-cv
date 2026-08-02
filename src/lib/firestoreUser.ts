import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type {
  CvInstance,
  CvThemeSettings,
  MasterProfile,
  UserDoc,
  UserEconomy,
} from "../types";
import { DEFAULT_ECONOMY } from "../types";

export async function loadUserDoc(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(getDb(), "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserDoc;
}

export async function ensureUserDoc(
  uid: string,
  profile: MasterProfile
): Promise<UserDoc> {
  const existing = await loadUserDoc(uid);
  if (existing) return existing;
  const now = Date.now();
  const data: UserDoc = {
    profile,
    economy: { ...DEFAULT_ECONOMY },
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(getDb(), "users", uid), data);
  return data;
}

export async function saveMasterProfile(uid: string, profile: MasterProfile) {
  const ref = doc(getDb(), "users", uid);
  const existing = await loadUserDoc(uid);
  const now = Date.now();
  if (!existing) {
    await setDoc(ref, {
      profile,
      economy: { ...DEFAULT_ECONOMY },
      createdAt: now,
      updatedAt: now,
    } satisfies UserDoc);
    return;
  }
  await updateDoc(ref, { profile, updatedAt: now });
}

export async function listCvInstances(uid: string): Promise<CvInstance[]> {
  const q = query(
    collection(getDb(), "cv_instances"),
    where("userId", "==", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CvInstance, "id">) }));
}

export async function saveCvInstance(
  uid: string,
  instance: Omit<CvInstance, "id" | "userId"> & { id?: string }
): Promise<string> {
  const payload = {
    userId: uid,
    title: instance.title,
    sourceJobHint: instance.sourceJobHint || "",
    templateId: instance.templateId,
    data: instance.data,
    theme: instance.theme,
    clonedFrom: instance.clonedFrom || null,
    createdAt: instance.createdAt,
    updatedAt: Date.now(),
  };
  if (instance.id && !instance.id.startsWith("local-")) {
    await setDoc(doc(getDb(), "cv_instances", instance.id), payload, {
      merge: true,
    });
    return instance.id;
  }
  const ref = await addDoc(collection(getDb(), "cv_instances"), payload);
  return ref.id;
}

export type { UserEconomy, CvThemeSettings };
