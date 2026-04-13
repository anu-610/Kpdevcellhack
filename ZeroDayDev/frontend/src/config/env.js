const env = import.meta.env;

export const config = {
  apiBaseUrl: env.VITE_API_BASE_URL || "http://localhost:5001/api",
  collegeEmailDomain: env.VITE_COLLEGE_EMAIL_DOMAIN || "students.iitmandi.ac.in",
  firebase: {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID
  }
};

export function hasFirebaseConfig() {
  return Boolean(
    config.firebase.apiKey &&
      config.firebase.authDomain &&
      config.firebase.projectId &&
      config.firebase.appId
  );
}
