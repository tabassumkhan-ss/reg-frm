import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBjGt9muhc9pA5_5Nuxl00eD4wH0w9ad_k",
  authDomain: "phoneverification-bb3e3.firebaseapp.com",
  projectId: "phoneverification-bb3e3",
  storageBucket: "phoneverification-bb3e3.appspot.com", // <-- fixed typo
  messagingSenderId: "339438265236",
  appId: "1:339438265236:web:f821cd2cb275e45de8e581",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);