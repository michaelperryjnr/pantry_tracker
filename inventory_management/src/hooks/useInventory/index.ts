import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/setup";
import { IInventory } from "@/interfaces";
import { v4 as uuid } from "uuid";

const useInventory = () => {
  const addItem = async (item: Partial<IInventory>) => {
    const docRef = doc(collection(db, "inventory"), item.name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(
        docRef,
        {
          quantity: (quantity || 0) + (item.quantity || 1),
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } else {
      await setDoc(docRef, {
        id: uuid(),
        name: item.name,
        quantity: item.quantity || 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    return await getDoc(docRef);
  };

  const removeItem = async (item: string) => {
    try {
      const docRef = doc(collection(db, "inventory"), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
      }
      return docSnap;
    } catch (error: any) {
      console.error(error);
    }
  };

  const decreaseQuantity = async (name: string) => {
    try {
      const docRef = doc(collection(db, "inventory"), name);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity <= 1) {
          await deleteDoc(docRef);
        } else {
          await updateDoc(docRef, {
            quantity: quantity - 1,
            updatedAt: Timestamp.now(),
          });
        }
      }
      return await getDoc(docRef);
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  };

  const increaseQuantity = async (name: string) => {
    try {
      const docRef = doc(collection(db, "inventory"), name);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await updateDoc(docRef, {
          quantity: (quantity || 0) + 1,
          updatedAt: Timestamp.now(),
        });
      }
      return await getDoc(docRef);
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  };

  return { addItem, removeItem, increaseQuantity, decreaseQuantity };
};

export default useInventory;
