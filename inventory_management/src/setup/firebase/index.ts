import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../configs";

const app = initializeApp(firebaseConfig);

//exports
const db = getFirestore(app);

export { db };
