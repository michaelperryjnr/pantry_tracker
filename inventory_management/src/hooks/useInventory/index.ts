import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/setup";
import { IInventory } from "@/interfaces";
import { v4 as uuid } from "uuid";
import firebase from "firebase/compat/app";

const useInventory = () => {
  const addItem = async (item: IInventory) => {
    const docRef = doc(collection(db, "inventory"), item.name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    return docSnap;
  };

  const removeItem = async (item: IInventory) => {
    const docRef = doc(collection(db, "inventory"), item.name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    return docSnap;
  };

  return { addItem, removeItem };
};

export default useInventory;
