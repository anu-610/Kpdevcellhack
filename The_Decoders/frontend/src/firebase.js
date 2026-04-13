import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCvbUWj6VkJz1PGOrkf8e-mba1HQLO4ZFY',
  authDomain: 'kp-devcell.firebaseapp.com',
  projectId: 'kp-devcell',
  storageBucket: 'kp-devcell.firebasestorage.app',
  messagingSenderId: '497778856161',
  appId: '1:497778856161:web:00c23e97847de4f5ab67a0',
  measurementId: 'G-43BJ3SCHXF'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)