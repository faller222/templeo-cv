import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase no configurado. Revisá VITE_FIREBASE_* en .env");
  }
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getDb() {
  return getFirestore(getFirebaseApp());
}

const googleProvider = new GoogleAuthProvider();

export function getLinkedInProvider() {
  const providerId =
    import.meta.env.VITE_FIREBASE_LINKEDIN_PROVIDER_ID || "oidc.linkedin";
  return new OAuthProvider(providerId);
}

export async function signInWithGoogle() {
  return signInWithPopup(getFirebaseAuth(), googleProvider);
}

export async function signInWithLinkedIn() {
  // Firebase OIDC token exchange omits LinkedIn client_secret → use our API.
  const { signInWithLinkedInManual } = await import("./linkedinAuth");
  return signInWithLinkedInManual();
}

export async function logOut() {
  return signOut(getFirebaseAuth());
}

export function watchAuth(cb: (user: User | null) => void) {
  if (!isFirebaseConfigured) {
    cb(null);
    return () => undefined;
  }
  return onAuthStateChanged(getFirebaseAuth(), cb);
}

export async function getIdToken(): Promise<string | null> {
  const user = getFirebaseAuth().currentUser;
  if (!user) return null;
  return user.getIdToken();
}
