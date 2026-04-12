import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBZ_vUVJ3RFJo4woIb3sZ-_Yof__MyML9c",
  authDomain: "kpweb-1ba95.firebaseapp.com",
  projectId: "kpweb-1ba95",
  storageBucket: "kpweb-1ba95.firebasestorage.app",
  messagingSenderId: "448761834395",
  appId: "1:448761834395:web:f3dfe20d4b509c3f9c0f3e"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
