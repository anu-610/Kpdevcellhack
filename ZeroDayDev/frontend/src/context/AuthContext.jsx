import { useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut
} from "firebase/auth";
import { config } from "../config/env.js";
import { auth, googleProvider } from "../lib/firebase.js";
import { AuthContext } from "./AuthContextValue.js";

function isAllowedCollegeEmail(email) {
  if (!config.collegeEmailDomain) return true;
  return email?.toLowerCase().endsWith(`@${config.collegeEmailDomain.toLowerCase()}`);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return undefined;
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
  }, []);

  async function signIn() {
    setAuthError("");

    if (!auth) {
      setAuthError("Firebase is not configured yet. Add your keys in .env.");
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      if (!isAllowedCollegeEmail(email)) {
        await firebaseSignOut(auth);
        setAuthError(`Use your college email ending with @${config.collegeEmailDomain}.`);
        return;
      }

      setUser(result.user);
    } catch (err) {
      setAuthError(err.message || "Unable to sign in right now.");
    }
  }

  async function signOut() {
    if (!auth) return;
    await firebaseSignOut(auth);
  }

  const value = useMemo(
    () => ({ user, authReady, authError, signIn, signOut }),
    [user, authReady, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
